import { Experience, ProfileLink, Project, Skill } from '@prisma/client';
import { ProfileRepository } from '../profile.repository';
import { ProfileLoaders, groupByProfileId } from './profile.loaders';

interface Row {
  id: string;
  profileId: string;
}

describe('groupByProfileId', () => {
  it('groups rows by profile id preserving the requested key order', () => {
    const rows: Row[] = [
      { id: 's2', profileId: 'p2' },
      { id: 's1', profileId: 'p1' },
      { id: 's3', profileId: 'p2' },
    ];

    const result = groupByProfileId(['p1', 'p2', 'p3'], rows);

    expect(result).toEqual([
      [{ id: 's1', profileId: 'p1' }],
      [
        { id: 's2', profileId: 'p2' },
        { id: 's3', profileId: 'p2' },
      ],
      [],
    ]);
  });

  it('returns an empty array for a key without rows', () => {
    expect(groupByProfileId(['missing'], [])).toEqual([[]]);
  });
});

describe('ProfileLoaders', () => {
  const repository = {
    findLinksByProfileIds: jest.fn(),
    findSkillsByProfileIds: jest.fn(),
    findExperienceByProfileIds: jest.fn(),
    findProjectsByProfileIds: jest.fn(),
  };

  let loaders: ProfileLoaders;

  beforeEach(() => {
    jest.resetAllMocks();
    loaders = new ProfileLoaders(repository as unknown as ProfileRepository);
  });

  it('batches skill lookups for multiple profiles into a single query', async () => {
    repository.findSkillsByProfileIds.mockResolvedValue([
      { id: 's1', profileId: 'p1', name: 'TypeScript' },
      { id: 's2', profileId: 'p2', name: 'Python' },
    ] as unknown as Skill[]);

    const [first, second] = await Promise.all([
      loaders.skills.load('p1'),
      loaders.skills.load('p2'),
    ]);

    expect(repository.findSkillsByProfileIds).toHaveBeenCalledTimes(1);
    expect(repository.findSkillsByProfileIds).toHaveBeenCalledWith(['p1', 'p2']);
    expect(first.map((skill) => skill.name)).toEqual(['TypeScript']);
    expect(second.map((skill) => skill.name)).toEqual(['Python']);
  });

  it('caches repeated keys within one request', async () => {
    repository.findProjectsByProfileIds.mockResolvedValue([
      { id: 'pr1', profileId: 'p1', name: 'Taxi' },
    ] as unknown as Project[]);

    const [first, second] = await Promise.all([
      loaders.projects.load('p1'),
      loaders.projects.load('p1'),
    ]);

    expect(repository.findProjectsByProfileIds).toHaveBeenCalledTimes(1);
    expect(first).toBe(second);
  });

  it('returns empty collections for a profile without relations', async () => {
    repository.findLinksByProfileIds.mockResolvedValue([] as ProfileLink[]);
    repository.findExperienceByProfileIds.mockResolvedValue([] as Experience[]);

    await expect(loaders.links.load('p1')).resolves.toEqual([]);
    await expect(loaders.experience.load('p1')).resolves.toEqual([]);
  });
});
