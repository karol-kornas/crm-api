import { prepareUserWithRole } from "@/modules/auth/tests/helpers";
import { addMembers, createProject } from "@/modules/projects/tests/helpers";
import { createTicket, updateTicket } from "./helpers";
import { messageKeys } from "@/config/message-keys";
import { USER_POSITION } from "@/constants/enums";

jest.mock("@/mail/mail.service");

describe("PATCH api/tickets/:id", () => {
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

  it("should update ticket", async () => {
    const resUpdateTicket = await updateTicket(token, ticketId);
    expect(resUpdateTicket.statusCode).toBe(200);
    expect(resUpdateTicket.body.data.ticket.title).toBe("New ticket updated");
  });

  it("should return 403 if user not member project", async () => {
    const resUpdateTicket = await updateTicket(user2.token, ticketId);
    expect(resUpdateTicket.statusCode).toBe(403);
    expect(resUpdateTicket.body.message).toBe(messageKeys.PROJECT.PERMISSION.NOT_A_MEMBER);
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
    const resUpdateTicket = await updateTicket(user2.token, ticketId);
    expect(resUpdateTicket.statusCode).toBe(403);
    expect(resUpdateTicket.body.message).toBe(messageKeys.TICKET.PERMISSION.FORBIDDEN);
  });

  it("should return 400 if invalid data", async () => {
    const ticketData = {
      ticketData: {
        title: "",
      },
    };
    const resUpdateTicket = await updateTicket(token, ticketId, ticketData);
    expect(resUpdateTicket.statusCode).toBe(400);
    expect(resUpdateTicket.body.message).toBe(messageKeys.VALIDATE.FAILED);
  });

  it("should return 401 if invalid token", async () => {
    const ticketData = {
      ticketData: {
        title: "",
      },
    };
    const resUpdateTicket = await updateTicket("invalid_token", ticketId, ticketData);
    expect(resUpdateTicket.statusCode).toBe(401);
    expect(resUpdateTicket.body.message).toBe(messageKeys.TOKEN.INVALID);
  });

  it("should return 404 if ticket not found", async () => {
    const resUpdateTicket = await updateTicket(token, "64b6e3b6e7f2a1a1a1a1a1a1");
    expect(resUpdateTicket.statusCode).toBe(404);
    expect(resUpdateTicket.body.message).toBe(messageKeys.TICKET.NOT_FOUND);
  });
});
