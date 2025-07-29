import { IUser, IUserModel } from "@/types/user";

export const userStatics = {
  findByEmail(this: IUserModel, email: string): Promise<IUser | null> {
    const normalizedEmail = email.trim().toLowerCase();
    return this.findOne({ email: normalizedEmail });
  },
};
