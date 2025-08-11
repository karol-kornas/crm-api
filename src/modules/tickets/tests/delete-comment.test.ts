import { prepareUserWithRole } from "@/modules/auth/tests/helpers";
import { createProject } from "@/modules/projects/tests/helpers";
import { addComment, createTicket, removeComment } from "./helpers";

jest.mock("@/mail/mail.service");

describe("POST api/tickets/:id/comments", () => {
  let token: string;
  let projectOwner: { token: string; userId: string };
  let user2: { token: string; userId: string };
  let admin: { token: string; userId: string };
  let projectId: string;
  let projectSlug: string;
  let ticketId: string;
  let commentId: string;

  beforeEach(async () => {
    projectOwner = await prepareUserWithRole("user");
    user2 = await prepareUserWithRole("user", "2");
    admin = await prepareUserWithRole("admin");
    token = projectOwner.token;

    const resProject = await createProject(token);
    projectId = resProject.body.data.project._id;
    projectSlug = resProject.body.data.project.slug;

    const resTicket = await createTicket(token, projectId, projectSlug);
    ticketId = resTicket.body.data.ticket._id;

    const resComment = await addComment(token, ticketId);
    commentId = resComment.body.data.comment._id;
  });

  it("should remove ticket comment", async () => {
    const resComment = await removeComment(admin.token, ticketId, commentId);
    expect(resComment.statusCode).toBe(200);
  });

  it("should 403 if user not permission to delete comment", async () => {
    const resComment = await removeComment(user2.token, ticketId, commentId);
    expect(resComment.statusCode).toBe(403);
  });
});
