import { prepareUserWithRole } from "@/auth/tests/helpers";
import { createProject } from "./helpers";
import { messageKeys } from "@/config/messageKeys";
import { IProject } from "@/types/project";
import { ENVIRONMENTS } from "@/constants/enums";
import { Project } from "@/models/project/project.model";
import { User } from "@/models/user/user.model";

jest.mock("@/mail/mail.service");

describe("POST api/project/create", () => {
  let token: string;

  beforeEach(async () => {
    token = await prepareUserWithRole("user");
  });

  it("should create new project", async () => {
    const resProject = await createProject(token);

    expect(resProject.body.data.slug).toBeDefined();
    expect(resProject.body.data.slug).toMatch(/test-project/);
    expect(resProject.statusCode).toBe(201);
    expect(resProject.body.success).toBe(true);
  });

  it("should return 409 if project name already exists", async () => {
    const resProject = await createProject(token);

    expect(resProject.statusCode).toBe(201);
    expect(resProject.body.success).toBe(true);

    const resProjectSecond = await createProject(token);

    expect(resProjectSecond.statusCode).toBe(409);
    expect(resProjectSecond.body.success).toBe(false);
    expect(resProjectSecond.body.message).toBe(messageKeys.PROJECT.CREATE.NAME_ALREADY_EXISTS);
  });

  it("should return 400 if project name is not provided", async () => {
    const projectData: IProject = {
      name: "",
      description: "description project",
      tags: ["CRM", "backend"],
    } as IProject;

    const resProject = await createProject(token, projectData);

    expect(resProject.statusCode).toBe(400);
    expect(resProject.body.success).toBe(false);
    expect(resProject.body.message).toBe(messageKeys.VALIDATE.FAILED);
    expect(resProject.body.errors.filter((el: any) => el.path === "name")).toBeTruthy();
  });

  it("should create new project with credentials", async () => {
    const projectData = {
      name: "Test project",
      description: "description project",
      tags: ["CRM", "backend"],
      credentials: [
        {
          name: "Dane do panelu admina",
          environment: ENVIRONMENTS[0],
        },
      ],
    } as Partial<IProject>;

    const resProject = await createProject(token, projectData);

    expect(resProject.statusCode).toBe(201);
    expect(resProject.body.success).toBe(true);

    const project = await Project.findOne({ slug: resProject.body.data.slug });

    expect(project?.credentials[0].name).toBe("Dane do panelu admina");
    expect(project?.credentials[0].owner.toString()).toBe(project?.owner.toString());
  });

  it("should return 403 if client tries to create project", async () => {
    token = await prepareUserWithRole("client");
    const resProject = await createProject(token);

    expect(resProject.statusCode).toBe(403);
    expect(resProject.body.success).toBe(false);
  });
});
