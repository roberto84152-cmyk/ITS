import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { Experience, ProfileLink, Project, Skill } from '@prisma/client';
import { ProfileRepository } from '../profile.repository';

interface OwnedByProfile {
  profileId: string;
}

export function groupByProfileId<T extends OwnedByProfile>(
  profileIds: readonly string[],
  rows: readonly T[],
): T[][] {
  const grouped = new Map<string, T[]>();

  for (const profileId of profileIds) {
    grouped.set(profileId, []);
  }

  for (const row of rows) {
    grouped.get(row.profileId)?.push(row);
  }

  return profileIds.map((profileId) => grouped.get(profileId) ?? []);
}

@Injectable({ scope: Scope.REQUEST })
export class ProfileLoaders {
  readonly links: DataLoader<string, ProfileLink[]>;
  readonly skills: DataLoader<string, Skill[]>;
  readonly experience: DataLoader<string, Experience[]>;
  readonly projects: DataLoader<string, Project[]>;

  constructor(private readonly repository: ProfileRepository) {
    this.links = new DataLoader((profileIds) => this.loadLinks(profileIds));
    this.skills = new DataLoader((profileIds) => this.loadSkills(profileIds));
    this.experience = new DataLoader((profileIds) => this.loadExperience(profileIds));
    this.projects = new DataLoader((profileIds) => this.loadProjects(profileIds));
  }

  private async loadLinks(profileIds: readonly string[]): Promise<ProfileLink[][]> {
    const rows = await this.repository.findLinksByProfileIds(profileIds);
    return groupByProfileId(profileIds, rows);
  }

  private async loadSkills(profileIds: readonly string[]): Promise<Skill[][]> {
    const rows = await this.repository.findSkillsByProfileIds(profileIds);
    return groupByProfileId(profileIds, rows);
  }

  private async loadExperience(profileIds: readonly string[]): Promise<Experience[][]> {
    const rows = await this.repository.findExperienceByProfileIds(profileIds);
    return groupByProfileId(profileIds, rows);
  }

  private async loadProjects(profileIds: readonly string[]): Promise<Project[][]> {
    const rows = await this.repository.findProjectsByProfileIds(profileIds);
    return groupByProfileId(profileIds, rows);
  }
}
