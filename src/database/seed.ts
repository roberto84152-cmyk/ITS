import 'reflect-metadata';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { SeedModule } from './seed.module';
import {
  AVATAR_KEY,
  PROFILE_ID,
  experience,
  links,
  profileData,
  projects,
  skills,
} from './seed-data';

const logger = new Logger('Seed');
const AVATAR_PATH = join(__dirname, '..', '..', 'assets', 'avatar.svg');

async function seedProfile(prisma: PrismaService): Promise<void> {
  await prisma.profile.upsert({
    where: { id: PROFILE_ID },
    create: { id: PROFILE_ID, ...profileData },
    update: profileData,
  });

  for (const link of links) {
    const { id, ...data } = link;
    await prisma.profileLink.upsert({
      where: { id },
      create: { id, profileId: PROFILE_ID, ...data },
      update: data,
    });
  }

  for (const skill of skills) {
    const { id, ...data } = skill;
    await prisma.skill.upsert({
      where: { id },
      create: { id, profileId: PROFILE_ID, ...data },
      update: data,
    });
  }

  for (const item of experience) {
    const { id, startDate, endDate, ...data } = item;
    const dates = {
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
    };
    await prisma.experience.upsert({
      where: { id },
      create: { id, profileId: PROFILE_ID, ...data, ...dates },
      update: { ...data, ...dates },
    });
  }

  for (const project of projects) {
    const { id, ...data } = project;
    await prisma.project.upsert({
      where: { id },
      create: { id, profileId: PROFILE_ID, ...data },
      update: data,
    });
  }

  await Promise.all([
    prisma.profileLink.deleteMany({
      where: { profileId: PROFILE_ID, id: { notIn: links.map((link) => link.id) } },
    }),
    prisma.skill.deleteMany({
      where: { profileId: PROFILE_ID, id: { notIn: skills.map((skill) => skill.id) } },
    }),
    prisma.experience.deleteMany({
      where: { profileId: PROFILE_ID, id: { notIn: experience.map((item) => item.id) } },
    }),
    prisma.project.deleteMany({
      where: { profileId: PROFILE_ID, id: { notIn: projects.map((project) => project.id) } },
    }),
  ]);

  logger.log(`Seeded profile "${profileData.name}" with ${skills.length} skills`);
}

async function uploadAvatar(storage: StorageService): Promise<void> {
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await storage.ensureBucket();
      const body = await readFile(AVATAR_PATH);
      await storage.uploadObject(AVATAR_KEY, body, 'image/svg+xml');
      logger.log(`Avatar uploaded to S3 as "${AVATAR_KEY}"`);
      return;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      if (attempt === maxAttempts) {
        logger.warn(`Avatar upload skipped after ${maxAttempts} attempts: ${message}`);
        return;
      }

      logger.warn(`S3 is not ready (attempt ${attempt}/${maxAttempts}): ${message}`);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createApplicationContext(SeedModule, {
    logger: ['log', 'warn', 'error'],
  });

  try {
    const prisma = app.get(PrismaService);
    const storage = app.get(StorageService);

    await seedProfile(prisma);
    await uploadAvatar(storage);
  } finally {
    await app.close();
  }
}

bootstrap().catch((error: unknown) => {
  logger.error('Seeding failed', error instanceof Error ? error.stack : String(error));
  process.exitCode = 1;
});
