import { messageKeys } from "@/config/message-keys";
import createError from "http-errors";
import { getAccessibleProjectIds } from "./get-accessible-project-ids.util";

export const getAndAssertAccessibleProjectIds = async (
  userId: string,
  userRole: string,
  projectId?: string
): Promise<string[]> => {
  if (userRole === "admin") return [];

  const accessibleProjectIds = await getAccessibleProjectIds(userId);

  if (accessibleProjectIds.length === 0) {
    throw createError(403, messageKeys.PROJECT.PERMISSION.NOT_ACCESS_TO_ANY_PROJECTS);
  }

  if (projectId && !accessibleProjectIds.includes(String(projectId))) {
    throw createError(403, messageKeys.PROJECT.PERMISSION.NOT_A_MEMBER);
  }

  return accessibleProjectIds;
};
