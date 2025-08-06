import bcrypt from "bcrypt";
import { ACCOUNT_LOCK_MINUTES, MAX_LOGIN_ATTEMPTS } from "@/config";
import { IUser } from "@/types/auth/model.type";

export const userMethods = {
  isAccountLocked(this: IUser): boolean {
    return !!this.lockedUntil && this.lockedUntil > new Date();
  },
  async comparePassword(this: IUser, candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
  },
  async incrementLoginAttempts(this: IUser): Promise<void> {
    this.loginAttempts += 1;

    if (this.loginAttempts > MAX_LOGIN_ATTEMPTS) {
      this.lockedUntil = new Date(Date.now() + ACCOUNT_LOCK_MINUTES * 60 * 1000);
      this.loginAttempts = 0;
    }

    await this.save();
  },
  async resetLoginAttempts(this: IUser): Promise<void> {
    this.loginAttempts = 0;
    this.lockedUntil = undefined;

    await this.save();
  },
  async markLastLogin(this: IUser): Promise<void> {
    this.lastLoginAt = new Date();
    await this.save();
  },
};
