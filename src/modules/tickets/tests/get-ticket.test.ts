import { prepareUserWithRole } from "@/modules/auth/tests/helpers";
import { addMembers, createProject } from "@/modules/projects/tests/helpers";
import { createTicket, getTickets } from "./helpers";
import { messageKeys } from "@/config/message-keys";
import { USER_POSITION } from "@/constants/enums";
import { TicketBody } from "@/types/ticktes/body.type";

jest.mock("@/mail/mail.service");

describe("GET api/tickets", () => {
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

    const resTicket = await createTicket(token, projectId, projectSlug);

    const ticketData2: TicketBody = {
      ticketData: {
        title: "New ticket 2",
        description: "Description ticket",
        projectId,
      },
    };
    const resTicket2 = await createTicket(token, projectId, projectSlug, ticketData2);
  });

  it("should return tickets", async () => {
    const res = await getTickets(token);
    expect(res.statusCode).toBe(200);
  });
  it("should return 403 if tickets not member project", async () => {
    const res = await getTickets(user2.token);
    expect(res.statusCode).toBe(403);
  });
});
