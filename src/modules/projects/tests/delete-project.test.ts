import { prepareUserWithRole } from "@/modules/auth/tests/helpers";
import { createProject, deleteProject } from "./helpers";
import { USER_POSITION } from "@/constants/enums";

jest.mock("@/mail/mail.service");

describe("DELETE api/projects/", () => {
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

  it("should create new project with members and delete all", async () => {
    const projectData = {
      projectData: {
        name: "Test project with members",
        description: "description project",
        deadline: new Date("2030-09-30"),
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
      },
    };

    const resProject = await createProject(token, projectData);

    expect(resProject.body.data.project.slug).toBeDefined();
    expect(resProject.body.data.project.slug).toMatch(/test-project-with-members/);
    expect(resProject.statusCode).toBe(201);
    expect(resProject.body.success).toBe(true);
    expect(resProject.body.data.project.members).toBeTruthy();

    const resDeletedProject = await deleteProject(token, "test-project-with-members");

    expect(resDeletedProject.body.success).toBe(true);
    expect(resDeletedProject.statusCode).toBe(200);
  });
});
