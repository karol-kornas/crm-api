import { prepareUserWithRole } from "@/modules/auth/tests/helpers";
import { createProject } from "./helpers";
import { messageKeys } from "@/config/message-keys";
import { IProject } from "@/types/project";
import { ENVIRONMENTS, USER_POSITION } from "@/constants/enums";
import { Project } from "@/models/project/project.model";

jest.mock("@/mail/mail.service");

describe("POST api/projects/", () => {
  let token: string;
  let user1: { token: string; userId: string };
  let user2: { token: string; userId: string };
  let user3: { token: string; userId: string };

  beforeEach(async () => {
    user1 = await prepareUserWithRole("user");
    user2 = await prepareUserWithRole("user", "2");
    user3 = await prepareUserWithRole("user", "3");

    token = user1.token;
  });

  it("should create new project", async () => {
    const resProject = await createProject(token);

    expect(resProject.body.data.project.slug).toBeDefined();
    expect(resProject.body.data.project.slug).toMatch(/test-project/);
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
    const projectData = {
      name: "",
      description: "description project",
      tags: ["CRM", "backend"],
    };

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
          name: "Data admin panel",
          environment: ENVIRONMENTS[0],
        },
      ],
    };

    const resProject = await createProject(token, projectData);

    expect(resProject.statusCode).toBe(201);
    expect(resProject.body.success).toBe(true);

    const project = await Project.findOne({ slug: resProject.body.data.project.slug });

    expect(project?.credentials[0].name).toBe("Data admin panel");
    expect(project?.credentials[0].owner.toString()).toBe(project?.owner.toString());
  });

  it("should return 403 if client tries to create project", async () => {
    const userClient = await prepareUserWithRole("client");
    const resProject = await createProject(userClient.token);

    expect(resProject.statusCode).toBe(403);
    expect(resProject.body.success).toBe(false);
  });

  it("should create new project with members", async () => {
    const projectData = {
      name: "Test project with members",
      description: "description project",
      deadline: "2030-09-30",
      tags: ["CRM", "backend"],
      members: [
        {
          userId: user2.userId,
          position: USER_POSITION[0],
          permissions: {
            canEditProject: true,
          },
        },
        {
          userId: user3.userId,
          position: USER_POSITION[1],
        },
      ],
    };

    const resProject = await createProject(token, projectData);

    expect(resProject.body.data.project.slug).toBeDefined();
    expect(resProject.body.data.project.slug).toMatch(/test-project-with-members/);
    expect(resProject.statusCode).toBe(201);
    expect(resProject.body.success).toBe(true);
    expect(resProject.body.data.project.members).toBeTruthy();

  });
});
