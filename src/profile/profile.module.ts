import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { ProfileLoaders } from './loaders/profile.loaders';
import { ProfileRepository } from './profile.repository';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';

@Module({
  imports: [StorageModule],
  providers: [ProfileRepository, ProfileService, ProfileLoaders, ProfileResolver],
})
export class ProfileModule {}
