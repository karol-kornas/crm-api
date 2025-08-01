// utils/TokenValidator.ts
import createError from "http-errors";
import { messageKeys } from "@/config/message-keys";
import { IUser } from "@/types/user";
import { User } from "@/models/user/user.model";

export class TokenValidator {
  static async validate(token: string, tokenField: keyof IUser, expiresField: keyof IUser): Promise<IUser> {
    if (!token) {
      throw createError(401, messageKeys.TOKEN.MISSING);
    }

    const query = { [tokenField]: token } as any;
    const user = await User.findOne(query);

    if (!user) {
      throw createError(401, messageKeys.TOKEN.INVALID);
    }

    const expiresAt = user[expiresField] as Date | undefined;

    if (!expiresAt) {
      throw createError(401, messageKeys.TOKEN.EXPIRES_MISSING);
    }

    if (expiresAt < new Date()) {
      throw createError(401, messageKeys.TOKEN.EXPIRED);
    }

    return user;
  }
}
