import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { LinkKind } from '@prisma/client';

registerEnumType(LinkKind, { name: 'LinkKind' });

@ObjectType('ProfileLink')
export class ProfileLinkEntity {
  @Field(() => ID)
  id: string;

  @Field()
  label: string;

  @Field()
  url: string;

  @Field(() => LinkKind)
  kind: LinkKind;
}
