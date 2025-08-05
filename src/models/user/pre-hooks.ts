import { IUser } from "@/types/auth/model.type";
import bcrypt from "bcrypt";
import { Schema } from "mongoose";

export const userPreHooks = (schema: Schema) => {
  schema.pre("save", async function (this: IUser, next) {
    if (!this.isModified("password")) return next();

    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (err) {
      next(err as Error);
    }
  });
};
