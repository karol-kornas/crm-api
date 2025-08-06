import { IUser } from "@/types/auth/model.type";
import { Schema } from "mongoose";

export const userVirtuals = (schema: Schema) => {
  schema.virtual("fullName").get(function (this: IUser): string {
    return `${this.firstName} ${this.lastName}`;
  });
};
