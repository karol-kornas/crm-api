import { prepareUserWithRole } from "@/modules/auth/tests/helpers";
import { createProject, getProjects } from "./helpers";

jest.mock("@/mail/mail.service");

describe("GET api/projects/", () => {
  let token: string;
  let projectOwner: { token: string; userId: string };
  let user2: { token: string; userId: string };

  beforeEach(async () => {
    projectOwner = await prepareUserWithRole("user");
    user2 = await prepareUserWithRole("user", "2");

    token = projectOwner.token;

    const resProject = await createProject(token);
    expect(resProject.statusCode).toBe(201);
  });

  it("should get all projects", async () => {
    const resGetProjects = await getProjects(token);
    expect(resGetProjects.statusCode).toBe(200);
  });

  it("should return 403 if user not member", async () => {
    const resGetProjects = await getProjects(user2.token);
    expect(resGetProjects.statusCode).toBe(403);
  });
});
