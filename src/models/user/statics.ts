import { IUser, IUserModel } from "@/types/user";

export const userStatics = {
  findByEmail(this: IUserModel, email: string): Promise<IUser | null> {
    return this.findOne({ email });
  },
};
