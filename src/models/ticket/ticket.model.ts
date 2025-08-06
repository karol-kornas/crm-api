import { PRIORITY, TICKET_STATUSES } from "@/constants/enums";
import { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ticketSchemaFields = {
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: TICKET_STATUSES,
    default: TICKET_STATUSES[0],
  },
  priority: {
    type: String,
    enum: PRIORITY,
    defaylt: PRIORITY[0],
  },
  tags: {
    type: [String],
    default: [],
  },
  relatedTask: {
    type: [Schema.Types.ObjectId],
    ref: "Task",
    default: [],
  },
};
