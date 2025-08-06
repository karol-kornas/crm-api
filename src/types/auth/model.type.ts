import { Document, Model } from "mongoose";
import { Role, UserPosition } from "@/constants/enums";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profilePictureUrl?: string;
  password: string;
  isActive: boolean;
  isVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationTokenExpires?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  lastPasswordResetRequestedAt?: Date;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  loginAttempts: number;
  lockedUntil?: Date;
  role?: Role;
  position?: UserPosition;
  refreshTokens: {
    refreshToken: string;
    expiresAt: Date;
  }[];
  comparePassword(candidatePassword: string): Promise<boolean>;
  isAccountLocked(): boolean;
  incrementLoginAttempts(): Promise<void>;
  resetLoginAttempts(): Promise<void>;
  markLastLogin(): Promise<void>;
  toJSON(): Record<string, any>;
}

export interface IUserModel extends Model<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}
