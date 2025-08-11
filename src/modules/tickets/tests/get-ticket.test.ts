import { prepareUserWithRole } from "@/modules/auth/tests/helpers";
import { createProject, getProject } from "@/modules/projects/tests/helpers";
import { createTicket, getTicket, getTickets } from "./helpers";
import { TicketBody } from "@/types/ticktes/body.type";
import { ProjectMember } from "@/models/project/project-member.model";

jest.mock("@/mail/mail.service");

describe("GET api/tickets/:id", () => {
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

    const ticketData2: TicketBody = {
      ticketData: {
        title: "New ticket 2",
        description: "Description ticket",
        projectId,
      },
    };
    await createTicket(token, projectId, projectSlug, ticketData2);
  });

  it("should return ticket", async () => {
    const res = await getTicket(token, ticketId);
    expect(res.statusCode).toBe(200);
  });
});
