import { ICredential, IProject } from "@/types/project";
import { Schema, model } from "mongoose";
import { projectPreHooks } from "./preHooks";
import { ENVIRONMENTS, PROJECT_STATUSES } from "@/constants/enums";
import { projectVirtuals } from "./virtuals";

const CredentialSchema = new Schema<ICredential>(
  {
    name: { type: String, required: true, trim: true },
    url: String,
    username: String,
    password: {
      type: String,
      select: false,
    },
    encrypted_password: String,
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
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
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
  credentials: [CredentialSchema],
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
    type: [String], // albo ref do kolekcji plików
    default: [],
  },
};

const projectSchemaOptions = {
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
};

const ProjectSchema = new Schema<IProject>(projectSchemaFields, projectSchemaOptions);
projectPreHooks(ProjectSchema);
projectVirtuals(ProjectSchema);

export const Project = model<IProject>("Project", ProjectSchema);
