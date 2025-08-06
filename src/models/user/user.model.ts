import { Schema, model } from "mongoose";
import { userMethods } from "./methods";
import { userStatics } from "./statics";
import { userVirtuals } from "./virtuals";
import { userPreHooks } from "./pre-hooks";
import { ROLES, USER_POSITION } from "@/constants/enums";
import { IUser, IUserModel } from "@/types/auth/model.type";

const userSchemaFields = {
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
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
  profilePictureUrl: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  emailVerificationToken: {
    type: String,
  },
  emailVerificationTokenExpires: {
    type: Date,
  },
  passwordResetToken: {
    type: String,
  },
  passwordResetTokenExpires: {
    type: Date,
  },
  lastPasswordResetRequestedAt: {
    type: Date,
  },
  lastLoginAt: {
    type: Date,
  },
  loginAttempts: {
    type: Number,
    default: 0,
  },
  lockedUntil: {
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
  refreshTokens: [
    {
      refreshToken: { type: String, required: true },
      expiresAt: { type: Date, required: true },
    },
  ],
} as const;

const userSchemaOptions = {
  timestamps: true,
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
    delete obj.refreshTokens;
    delete obj.verificationToken;
    delete obj.verificationTokenExpires;
  }
  return obj;
};

export const User = model<IUser, IUserModel>("User", UserSchema);
