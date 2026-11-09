import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  BucketLocationConstraint,
  CreateBucketCommand,
  GetObjectCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const DEFAULT_PRESIGNED_URL_TTL_SECONDS = 60 * 60;

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly bucket: string;
  private readonly region: string;
  private readonly client: S3Client;
  private readonly presignClient: S3Client;

  constructor(private readonly config: ConfigService) {
    this.bucket = this.config.getOrThrow<string>('S3_BUCKET');
    this.region = this.config.get<string>('S3_REGION', 'us-east-1');

    const credentials = {
      accessKeyId: this.config.getOrThrow<string>('S3_ACCESS_KEY'),
      secretAccessKey: this.config.getOrThrow<string>('S3_SECRET_KEY'),
    };
    const sharedConfig = {
      region: this.region,
      credentials,
      forcePathStyle: true,
    };

    const internalEndpoint = this.config.getOrThrow<string>('S3_ENDPOINT');
    const publicEndpoint = this.config.get<string>('S3_PUBLIC_ENDPOINT') ?? internalEndpoint;

    this.client = new S3Client({
      ...sharedConfig,
      endpoint: internalEndpoint,
    });

    this.presignClient = new S3Client({
      ...sharedConfig,
      endpoint: publicEndpoint,
    });
  }

  async ensureBucket(): Promise<void> {
    try {
      await this.client.send(new HeadBucketCommand({ Bucket: this.bucket }));
    } catch {
      await this.client.send(
        new CreateBucketCommand({
          Bucket: this.bucket,
          ...(this.region === 'us-east-1'
            ? {}
            : {
                CreateBucketConfiguration: {
                  LocationConstraint: this.region as BucketLocationConstraint,
                },
              }),
        }),
      );
      this.logger.log(`Created S3 bucket "${this.bucket}"`);
    }
  }

  async uploadObject(key: string, body: Buffer, contentType: string): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: body,
        ContentType: contentType,
      }),
    );
  }

  async getPresignedGetUrl(
    key: string,
    expiresInSeconds = DEFAULT_PRESIGNED_URL_TTL_SECONDS,
  ): Promise<string> {
    return getSignedUrl(
      this.presignClient,
      new GetObjectCommand({ Bucket: this.bucket, Key: key }),
      {
        expiresIn: expiresInSeconds,
      },
    );
  }
}
