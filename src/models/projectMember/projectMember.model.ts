import { USER_POSITION } from "@/constants/enums";
import { IProjectMember } from "@/types/projectMember";
import { model, Schema } from "mongoose";

const projectMemberSchemaFields = {
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  position: {
    type: String,
    enum: USER_POSITION,
    default: USER_POSITION[0],
  },
  permissions: {
    canEditProject: { type: Boolean, default: false },
    canEditCredentials: { type: Boolean, default: false },
  },
};

const projectMemberSchemaOptions = {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
};

const ProjectMemberSchema = new Schema<IProjectMember>(projectMemberSchemaFields, projectMemberSchemaOptions);

ProjectMemberSchema.index({ project: 1, user: 1 }, { unique: true });

export const ProjectMember = model<IProjectMember>("ProjectMember", ProjectMemberSchema);
