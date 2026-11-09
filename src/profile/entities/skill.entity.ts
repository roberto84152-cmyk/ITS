import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { SkillCategory } from '@prisma/client';

registerEnumType(SkillCategory, { name: 'SkillCategory' });

@ObjectType('Skill')
export class SkillEntity {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => SkillCategory)
  category: SkillCategory;

  @Field(() => Int, { nullable: true })
  level: number | null;
}
