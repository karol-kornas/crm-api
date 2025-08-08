import { prepareUserWithRole } from "@/modules/auth/tests/helpers";
import { addMembers, createProject } from "@/modules/projects/tests/helpers";
import { createTicket } from "./helpers";
import { messageKeys } from "@/config/message-keys";
import { USER_POSITION } from "@/constants/enums";

jest.mock("@/mail/mail.service");

describe("POST api/projects/:slug/tickets", () => {
  let token: string;
  let projectOwner: { token: string; userId: string };
  let user2: { token: string; userId: string };
  let projectId: string;
  let projectSlug: string;

  beforeEach(async () => {
    projectOwner = await prepareUserWithRole("user");
    user2 = await prepareUserWithRole("user", "2");
    token = projectOwner.token;

    const resProject = await createProject(token);
    projectId = resProject.body.data.project._id;
    projectSlug = resProject.body.data.project.slug;
  });

  it("should create new ticket", async () => {
    const resTicket = await createTicket(token, projectId, projectSlug);

    expect(resTicket.statusCode).toBe(201);
    expect(resTicket.body.success).toBe(true);
    expect(resTicket.body.data.ticket.title).toBe("New ticket");
    expect(resTicket.body.data.ticket.description).toBe("Description ticket");
    expect(resTicket.body.data.ticket.createdBy).toBe(projectOwner.userId);
    expect(resTicket.body.data.ticket.project).toBe(projectId);
  });

  it("should return 401 if invalid token user", async () => {
    const resTicket = await createTicket("invalid_token", projectId, projectSlug);

    expect(resTicket.statusCode).toBe(401);
    expect(resTicket.body.success).toBe(false);
  });

  it("should return 404 if project not exsisting", async () => {
    const resTicket = await createTicket(token, projectId, "not-existing-project");

    expect(resTicket.statusCode).toBe(404);
    expect(resTicket.body.success).toBe(false);
  });

  it("should return 400 if invalid data ticket", async () => {
    const ticketData = {
      ticketData: {
        title: "",
      },
    } as any;
    const resTicket = await createTicket(token, projectId, projectSlug, ticketData);

    expect(resTicket.statusCode).toBe(400);
    expect(resTicket.body.success).toBe(false);
    expect(resTicket.body.message).toBe(messageKeys.VALIDATE.FAILED);
  });

  it("should return 403 if user is not a project member", async () => {
    const resTicket = await createTicket(user2.token, projectId, projectSlug);

    expect(resTicket.statusCode).toBe(403);
  });

  it("should create new ticket if user is member project", async () => {
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

    const resTicket = await createTicket(user2.token, projectId, projectSlug);

    expect(resTicket.statusCode).toBe(201);
  });
});
