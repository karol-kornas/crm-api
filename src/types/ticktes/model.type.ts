import { Document, Types } from "mongoose";
import { IProject } from "../projects/model.type";
import { IUser } from "../auth/model.type";
import { Priority, TicketStatus } from "@/constants/enums";

export interface ITicketComment {
  text: string;
  author: Types.ObjectId | IUser;
  createdAt?: Date;
  updatedAt?: Date;
  _id?: Types.ObjectId;
}

export interface ITicket extends Document {
  title: string;
  description: string;
  project: Types.ObjectId | IProject;
  assignedTo?: Types.ObjectId | IUser;
  status: TicketStatus;
  priority: Priority;
  tags: string[];
  relatedTasks: Types.ObjectId[];
  comments: ITicketComment[];
  createdAt?: Date;
  updatedAt?: Date;
  createdBy: Types.ObjectId | IUser;
}
