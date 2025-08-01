import { Schema, model } from "mongoose";
import { userMethods } from "./methods";
import { userStatics } from "./statics";
import { userVirtuals } from "./virtuals";
import { userPreHooks } from "./pre-hooks";
import { IUser, IUserModel } from "@/types/user";
import { ROLES, USER_POSITION } from "@/constants/enums";

const userSchemaFields = {
  first_name: {
    type: String,
    required: true,
    trim: true,
  },
  last_name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Invalid email"],
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[0-9]{7,15}$/, "Invalid number phone"],
  },
  profile_picture_url: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  is_active: {
    type: Boolean,
    default: true,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  email_verification_token: {
    type: String,
  },
  email_verification_token_expires: {
    type: Date,
  },
  password_reset_token: {
    type: String,
  },
  password_reset_token_expires: {
    type: Date,
  },
  last_password_reset_requested_at: {
    type: Date,
  },
  last_login_at: {
    type: Date,
  },
  login_attempts: {
    type: Number,
    default: 0,
  },
  locked_until: {
    type: Date,
  },
  role: {
    type: String,
    enum: ROLES,
    default: ROLES[0],
  },
  position: {
    type: String,
    enum: USER_POSITION,
    default: USER_POSITION[0],
  },
  refresh_tokens: [
    {
      refresh_token: { type: String, required: true },
      expires_at: { type: Date, required: true },
    },
  ],
} as const;

const userSchemaOptions = {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
};

const UserSchema = new Schema<IUser>(userSchemaFields, userSchemaOptions);

Object.assign(UserSchema.methods, userMethods);
Object.assign(UserSchema.statics, userStatics);
userVirtuals(UserSchema);
userPreHooks(UserSchema);

UserSchema.methods.toJSON = function (this: IUser) {
  const obj = this.toObject?.() || {};
  delete obj.password;
  delete obj.__v;

  if (process.env.NODE_ENV !== "test") {
    delete obj.refresh_tokens;
    delete obj.verification_token;
    delete obj.verification_token_expires;
  }
  return obj;
};

export const User = model<IUser, IUserModel>("User", UserSchema);
