import { prepareUserWithRole } from "@/modules/auth/tests/helpers";
import { createProject, getProject } from "./helpers";

jest.mock("@/mail/mail.service");

describe("GET api/projects/:id", () => {
  let token: string;
  let projectOwner: { token: string; userId: string };
  let user2: { token: string; userId: string };
  let projectId: string;

  beforeEach(async () => {
    projectOwner = await prepareUserWithRole("user");
    user2 = await prepareUserWithRole("user", "2");

    token = projectOwner.token;

    const resProject = await createProject(token);
    expect(resProject.statusCode).toBe(201);
    projectId = resProject.body.data.project._id;
  });

  it("should get project", async () => {
    const resGetProjects = await getProject(token, projectId);
    expect(resGetProjects.statusCode).toBe(200);
  });

  it("should return 403 if user not member", async () => {
    const resGetProjects = await getProject(user2.token, projectId);
    expect(resGetProjects.statusCode).toBe(403);
  });
});
