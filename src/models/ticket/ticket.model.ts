import { PRIORITY, TICKET_STATUSES } from "@/constants/enums";
import { ITicket, ITicketComment } from "@/types/ticktes/model.type";
import { model, Schema } from "mongoose";

const commentSchema = new Schema<ITicketComment>(
  {
    text: {
      type: String,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
    default: PRIORITY[0],
  },
  tags: {
    type: [String],
    default: [],
  },
  relatedTasks: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  comments: {
    type: [commentSchema],
    default: [],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
};

const ticketSchemaOptions = {
  timestamps: true,
};

const TicketSchema = new Schema<ITicket>(ticketSchemaFields, ticketSchemaOptions);

export const Ticket = model<ITicket>("Ticket", TicketSchema);
export const TicketComment = model<ITicketComment>("TicketComment", commentSchema);
