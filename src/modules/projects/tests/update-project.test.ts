import { prepareUserWithRole } from "@/modules/auth/tests/helpers";
import { createProject, updateProject } from "./helpers";
import { messageKeys } from "@/config/message-keys";
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

  it("should update project", async () => {
    const resProject = await createProject(token);
    expect(resProject.statusCode).toBe(201);
    console.log(resProject.body.data.project.slug);
    const resUpdateProject = await updateProject(token, resProject.body.data.project.slug);

    console.log(resUpdateProject.body);
    expect(resUpdateProject.statusCode).toBe(200);
  });
});
