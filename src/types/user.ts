import { Document, Model } from "mongoose";
import { Role } from "@/config";

export interface IUser extends Document {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  profile_picture_url?: string;
  password: string;
  is_active: boolean;
  is_verified: boolean;
  verification_token?: string;
  verification_token_expires?: Date;
  last_login_at?: Date;
  created_at: Date;
  updated_at: Date;
  login_attempts: number;
  locked_until?: Date;
  role: Role;
  refresh_tokens: {
    token: string;
    expires_at: Date;
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
