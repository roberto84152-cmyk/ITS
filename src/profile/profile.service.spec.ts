import { NotFoundException } from '@nestjs/common';
import { Profile } from '@prisma/client';
import { StorageService } from '../storage/storage.service';
import { ProfileRepository } from './profile.repository';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  const repository = {
    findPrimary: jest.fn(),
    findAll: jest.fn(),
  };
  const storage = {
    getPresignedGetUrl: jest.fn(),
  };

  let service: ProfileService;

  beforeEach(() => {
    jest.resetAllMocks();
    service = new ProfileService(
      repository as unknown as ProfileRepository,
      storage as unknown as StorageService,
    );
  });

  it('returns the primary profile', async () => {
    const profile = { id: 'p1', name: 'Test' } as Profile;
    repository.findPrimary.mockResolvedValue(profile);

    await expect(service.getPrimaryProfile()).resolves.toBe(profile);
  });

  it('throws NotFoundException when the database has no profile', async () => {
    repository.findPrimary.mockResolvedValue(null);

    await expect(service.getPrimaryProfile()).rejects.toBeInstanceOf(NotFoundException);
  });

  it('returns null avatar url when no avatar key is stored', async () => {
    await expect(service.getAvatarUrl(null)).resolves.toBeNull();
    expect(storage.getPresignedGetUrl).not.toHaveBeenCalled();
  });

  it('delegates avatar url generation to the storage service', async () => {
    storage.getPresignedGetUrl.mockResolvedValue('https://s3.local/avatar.svg?signature=1');

    await expect(service.getAvatarUrl('avatars/profile.svg')).resolves.toBe(
      'https://s3.local/avatar.svg?signature=1',
    );
    expect(storage.getPresignedGetUrl).toHaveBeenCalledWith('avatars/profile.svg');
  });
});
