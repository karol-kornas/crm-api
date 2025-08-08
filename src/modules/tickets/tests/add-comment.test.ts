import { prepareUserWithRole } from "@/modules/auth/tests/helpers";
import { addMembers, createProject } from "@/modules/projects/tests/helpers";
import { addComment, createTicket } from "./helpers";
import { messageKeys } from "@/config/message-keys";
import { USER_POSITION } from "@/constants/enums";

jest.mock("@/mail/mail.service");

describe("POST api/projects/:slug/tickets", () => {
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

  it("should add ticket comment", async () => {
    const resComment = await addComment(token, ticketId);
    expect(resComment.statusCode).toBe(201);
  });

  it("should 403 if user not member project", async () => {
    const resComment = await addComment(user2.token, ticketId);
    expect(resComment.statusCode).toBe(403);
  });
});
