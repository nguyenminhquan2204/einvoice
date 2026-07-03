import { Prop, Schema } from '@nestjs/mongoose';
import { BaseSchema, createSchema } from './base.schema';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Schema({
  timestamps: true,
  collection: 'users',
})
export class User extends BaseSchema {
  @Prop({ type: String })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  userId: string;

  @Prop({ type: [ObjectId], ref: 'Role' })
  roles: ObjectId[];
}

export const UserSchema = createSchema(User);

export const UserModelName = User.name;

export const UserDestination = {
  name: UserModelName,
  schema: UserSchema,
};

export type UserModel = Model<User>;
