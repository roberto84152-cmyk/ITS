import { Injectable, NotFoundException } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { StorageService } from '../storage/storage.service';
import { ProfileRepository } from './profile.repository';

@Injectable()
export class ProfileService {
  constructor(
    private readonly repository: ProfileRepository,
    private readonly storage: StorageService,
  ) {}

  async getPrimaryProfile(): Promise<Profile> {
    const profile = await this.repository.findPrimary();

    if (!profile) {
      throw new NotFoundException('Profile has not been seeded yet');
    }

    return profile;
  }

  getProfiles(): Promise<Profile[]> {
    return this.repository.findAll();
  }

  async getAvatarUrl(avatarKey: string | null): Promise<string | null> {
    if (!avatarKey) {
      return null;
    }

    return this.storage.getPresignedGetUrl(avatarKey);
  }
}
