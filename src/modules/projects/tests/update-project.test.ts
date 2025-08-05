import { prepareUserWithRole } from "@/modules/auth/tests/helpers";
import { createProject, updateProject } from "./helpers";

jest.mock("@/mail/mail.service");

describe("PATCH api/projects/:slug", () => {
  let token: string;
  let projectOwner: { token: string; userId: string };
  let outsiderUser: { token: string; userId: string };

  beforeEach(async () => {
    projectOwner = await prepareUserWithRole("user");
    outsiderUser = await prepareUserWithRole("user", "2");

    token = projectOwner.token;
  });

  it("should update project", async () => {
    const resProject = await createProject(token);
    expect(resProject.statusCode).toBe(201);
    const resUpdateProject = await updateProject(token, resProject.body.data.project.slug);

    expect(resUpdateProject.statusCode).toBe(200);
    expect(resUpdateProject.body.data.project.description).toBe("New description");
  });

  it("should return 403 if not member try update project", async () => {
    const resProject = await createProject(token);
    expect(resProject.statusCode).toBe(201);
    const resUpdateProject = await updateProject(outsiderUser.token, resProject.body.data.project.slug);

    expect(resUpdateProject.statusCode).toBe(403);
  });

  it("should return 400 if try update project with name empty", async () => {
    const resProject = await createProject(token);
    expect(resProject.statusCode).toBe(201);
    const updateData = {
      projectData: {
        name: "",
        description: "New description",
      },
    };
    const resUpdateProject = await updateProject(token, resProject.body.data.project.slug, updateData);

    expect(resUpdateProject.statusCode).toBe(400);
  });

  it("should return 400 if projectData is missing", async () => {
    const resProject = await createProject(token);
    const res = await updateProject(token, resProject.body.data.project.slug, {} as any);
    expect(res.statusCode).toBe(400);
  });

  it("should return 404 if project does not exist", async () => {
    const res = await updateProject(token, "non-existing-slug");
    expect(res.statusCode).toBe(404);
  });
});
