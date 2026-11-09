import { Injectable } from '@nestjs/common';
import { Experience, Profile, ProfileLink, Project, Skill } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  findPrimary(): Promise<Profile | null> {
    return this.prisma.profile.findFirst({
      orderBy: { createdAt: 'asc' },
    });
  }

  findAll(): Promise<Profile[]> {
    return this.prisma.profile.findMany({
      orderBy: { createdAt: 'asc' },
    });
  }

  findLinksByProfileIds(profileIds: readonly string[]): Promise<ProfileLink[]> {
    return this.prisma.profileLink.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: [{ sortOrder: 'asc' }, { label: 'asc' }],
    });
  }

  findSkillsByProfileIds(profileIds: readonly string[]): Promise<Skill[]> {
    return this.prisma.skill.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  findExperienceByProfileIds(profileIds: readonly string[]): Promise<Experience[]> {
    return this.prisma.experience.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: [{ sortOrder: 'asc' }, { startDate: 'desc' }],
    });
  }

  findProjectsByProfileIds(profileIds: readonly string[]): Promise<Project[]> {
    return this.prisma.project.findMany({
      where: { profileId: { in: [...profileIds] } },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }
}
