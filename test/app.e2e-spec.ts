import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

process.env.S3_ENDPOINT ??= 'http://127.0.0.1:9000';
process.env.S3_PUBLIC_ENDPOINT ??= 'http://localhost:9000';
process.env.S3_REGION ??= 'us-east-1';
process.env.S3_BUCKET ??= 'visitcard';
process.env.S3_ACCESS_KEY ??= 'minioadmin';
process.env.S3_SECRET_KEY ??= 'minioadmin';

const PROFILE_QUERY = `
  query {
    profile {
      name
      description
      skills {
        name
      }
      experience {
        company
        position
      }
      projects {
        name
      }
    }
  }
`;

describe('Visit card (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns the profile with nested skills, experience and projects', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: PROFILE_QUERY })
      .expect(200);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.profile).toEqual(
      expect.objectContaining({
        name: expect.any(String),
        description: expect.any(String),
        skills: expect.arrayContaining([expect.objectContaining({ name: expect.any(String) })]),
        experience: expect.arrayContaining([
          expect.objectContaining({ company: expect.any(String), position: expect.any(String) }),
        ]),
        projects: expect.arrayContaining([expect.objectContaining({ name: expect.any(String) })]),
      }),
    );
  });

  it('returns all profiles with batched relations', async () => {
    const response = await request(app.getHttpServer())
      .post('/graphql')
      .send({ query: '{ profiles { name skills { name } projects { name } } }' })
      .expect(200);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.profiles.length).toBeGreaterThan(0);
    expect(response.body.data.profiles[0].skills.length).toBeGreaterThan(0);
  });

  it('exposes a health endpoint that checks the database', async () => {
    const response = await request(app.getHttpServer()).get('/health').expect(200);

    expect(response.body).toEqual(expect.objectContaining({ status: 'ok', database: 'up' }));
  });
});
