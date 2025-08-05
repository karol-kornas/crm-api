import bcrypt from "bcrypt";
import { ACCOUNT_LOCK_MINUTES, MAX_LOGIN_ATTEMPTS } from "@/config";
import { IUser } from "@/types/auth/model.type";

export const userMethods = {
  isAccountLocked(this: IUser): boolean {
    return !!this.locked_until && this.locked_until > new Date();
  },
  async comparePassword(this: IUser, candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword, this.password);
  },
  async incrementLoginAttempts(this: IUser): Promise<void> {
    this.login_attempts += 1;

    if (this.login_attempts > MAX_LOGIN_ATTEMPTS) {
      this.locked_until = new Date(Date.now() + ACCOUNT_LOCK_MINUTES * 60 * 1000);
      this.login_attempts = 0;
    }

    await this.save();
  },
  async resetLoginAttempts(this: IUser): Promise<void> {
    this.login_attempts = 0;
    this.locked_until = undefined;

    await this.save();
  },
  async markLastLogin(this: IUser): Promise<void> {
    this.last_login_at = new Date();
    await this.save();
  },
};
