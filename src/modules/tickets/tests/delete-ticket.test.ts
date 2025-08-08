import { prepareUserWithRole } from "@/modules/auth/tests/helpers";
import { addMembers, createProject } from "@/modules/projects/tests/helpers";
import { createTicket, deleteTicket } from "./helpers";
import { messageKeys } from "@/config/message-keys";
import { USER_POSITION } from "@/constants/enums";

jest.mock("@/mail/mail.service");

describe("DELETE api/tickets/:id", () => {
  let token: string;
  let projectOwner: { token: string; userId: string };
  let user2: { token: string; userId: string };
  let projectId: string;
  let projectSlug: string;
  let ticketId: string;

  beforeEach(async () => {
    projectOwner = await prepareUserWithRole("user");
    user2 = await prepareUserWithRole("user", "2");
    token = projectOwner.token;

    const resProject = await createProject(token);
    projectId = resProject.body.data.project._id;
    projectSlug = resProject.body.data.project.slug;

    const resTicket = await createTicket(token, projectId, projectSlug);
    ticketId = resTicket.body.data.ticket._id;
  });

  it("should delete ticket", async () => {
    const resDeleteTicket = await deleteTicket(token, ticketId);
    expect(resDeleteTicket.statusCode).toBe(200);
    expect(resDeleteTicket.body.success).toBe(true);
  });

  it("should return 404 if ticket not found", async () => {
    const resDeleteTicket = await deleteTicket(token, "64b8e223f5f0f60012ab1234");
    expect(resDeleteTicket.statusCode).toBe(404);
    expect(resDeleteTicket.body.success).toBe(false);
    expect(resDeleteTicket.body.message).toBe(messageKeys.TICKET.NOT_FOUND);
  });

  it("should return 403 if user member project but without permission", async () => {
    const membersData = {
      members: [
        {
          userId: user2.userId,
          position: USER_POSITION[2],
          permissions: {
            canEditProject: true,
          },
        },
      ],
    };

    await addMembers(token, projectSlug, membersData);
    const resDeleteTicket = await deleteTicket(user2.token, ticketId);
    expect(resDeleteTicket.statusCode).toBe(403);
    expect(resDeleteTicket.body.success).toBe(false);
    expect(resDeleteTicket.body.message).toBe(messageKeys.TICKET.PERMISSION.FORBIDDEN);
  });

  it("should return 401 if no token provided", async () => {
    const res = await deleteTicket("", ticketId);
    expect(res.statusCode).toBe(401);
  });
});
