import { ProjectMember } from "@/models/project/project-member.model";
import { Types } from "mongoose";

/**
 * Zwraca tablicę ObjectId projektów, do których użytkownik ma dostęp.
 */
export const getAccessibleProjectIds = async (userId: string | Types.ObjectId): Promise<Types.ObjectId[]> => {
  const memberships = await ProjectMember.find({ user: userId }).select("project");
  return memberships.map((m) => m.project as Types.ObjectId);
};
