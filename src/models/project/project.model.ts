import { Schema, model } from "mongoose";
import { projectPreHooks } from "./pre-hooks";
import { ENVIRONMENTS, PROJECT_STATUSES } from "@/constants/enums";
import { projectVirtuals } from "./virtuals";
import { ICredential, IProject } from "@/types/projects/model.type";

const CredentialSchema = new Schema<ICredential>(
  {
    name: { type: String, required: true, trim: true },
    url: String,
    username: String,
    password: {
      type: String,
      select: false,
    },
    encryptedPassword: String,
    notes: String,
    environment: {
      type: String,
      enum: ENVIRONMENTS,
      default: ENVIRONMENTS[0],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const projectSchemaFields = {
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true,
  },
  description: {
    type: String,
  },
  notes: {
    type: [String],
    default: [],
  },
  credentials: {
    type: [CredentialSchema],
    default: [],
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: PROJECT_STATUSES,
    required: true,
    default: PROJECT_STATUSES[0],
  },
  deadline: {
    type: Date,
  },
  tags: {
    type: [String],
    default: [],
  },
  archived: {
    type: Boolean,
    default: false,
  },
  attachments: {
    type: [String],
    default: [],
  },
};

const projectSchemaOptions = {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
};

const ProjectSchema = new Schema<IProject>(projectSchemaFields, projectSchemaOptions);
projectPreHooks(ProjectSchema);
projectVirtuals(ProjectSchema);

export const Project = model<IProject>("Project", ProjectSchema);
