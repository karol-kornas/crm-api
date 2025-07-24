import { Schema } from "mongoose";
import { IUser } from "@/types/user";

export const userVirtuals = (schema: Schema) => {
  schema.virtual("full_name").get(function (this: IUser): string {
    return `${this.first_name} ${this.last_name}`;
  });
};
