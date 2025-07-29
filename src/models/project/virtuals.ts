import { Schema } from "mongoose";

export const projectVirtuals = (schema: Schema) => {
  schema.virtual("members", {
    ref: "ProjectMember",
    localField: "_id",
    foreignField: "project",
  });
};
