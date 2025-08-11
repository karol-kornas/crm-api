import { prepareUserWithRole } from "@/modules/auth/tests/helpers";
import { createProject, getProjectsMinimal } from "./helpers";

jest.mock("@/mail/mail.service");

describe("GET api/projects/minimal", () => {
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

  it("should get all projects minimal", async () => {
    const resGetProjects = await getProjectsMinimal(token);
    expect(resGetProjects.statusCode).toBe(200);
  });

  it("should return 403 if user not member", async () => {
    const resGetProjects = await getProjectsMinimal(user2.token);
    expect(resGetProjects.statusCode).toBe(403);
  });
});
