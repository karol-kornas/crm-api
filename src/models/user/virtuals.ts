import { IUser } from "@/types/auth/model.type";
import { Schema } from "mongoose";

export const userVirtuals = (schema: Schema) => {
  schema.virtual("full_name").get(function (this: IUser): string {
    return `${this.first_name} ${this.last_name}`;
  });
};
