import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Profile } from '@prisma/client';
import {
  ExperienceEntity,
  ProfileEntity,
  ProfileLinkEntity,
  ProjectEntity,
  SkillEntity,
} from './entities';
import { ProfileLoaders } from './loaders/profile.loaders';
import { ProfileService } from './profile.service';

@Resolver(() => ProfileEntity)
export class ProfileResolver {
  constructor(
    private readonly profileService: ProfileService,
    private readonly loaders: ProfileLoaders,
  ) {}

  @Query(() => ProfileEntity)
  profile(): Promise<Profile> {
    return this.profileService.getPrimaryProfile();
  }

  @Query(() => [ProfileEntity])
  profiles(): Promise<Profile[]> {
    return this.profileService.getProfiles();
  }

  @ResolveField(() => String, { nullable: true })
  avatarUrl(@Parent() profile: Profile): Promise<string | null> {
    return this.profileService.getAvatarUrl(profile.avatarKey);
  }

  @ResolveField(() => [ProfileLinkEntity])
  links(@Parent() profile: Profile): Promise<ProfileLinkEntity[]> {
    return this.loaders.links.load(profile.id);
  }

  @ResolveField(() => [SkillEntity])
  skills(@Parent() profile: Profile): Promise<SkillEntity[]> {
    return this.loaders.skills.load(profile.id);
  }

  @ResolveField(() => [ExperienceEntity])
  experience(@Parent() profile: Profile): Promise<ExperienceEntity[]> {
    return this.loaders.experience.load(profile.id);
  }

  @ResolveField(() => [ProjectEntity])
  projects(@Parent() profile: Profile): Promise<ProjectEntity[]> {
    return this.loaders.projects.load(profile.id);
  }
}
