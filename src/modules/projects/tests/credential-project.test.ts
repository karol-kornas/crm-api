import { prepareUserWithRole } from "@/modules/auth/tests/helpers";
import { addCredential, createProject, removeCredential, updateCredential } from "./helpers";
import { messageKeys } from "@/config/message-keys";

jest.mock("@/mail/mail.service");

describe("api/projects/:slug/credentials", () => {
  let token: string;
  let user1: { token: string; userId: string };
  let user2: { token: string; userId: string };

  beforeEach(async () => {
    user1 = await prepareUserWithRole("user");
    user2 = await prepareUserWithRole("user", "2");

    token = user1.token;
  });

  it("should add credential to project", async () => {
    const resProject = await createProject(token);

    expect(resProject.statusCode).toBe(201);
    expect(resProject.body.success).toBe(true);

    const resAddCredential = await addCredential(token, resProject.body.data.project.slug);

    expect(resAddCredential.statusCode).toBe(201);
  });

  it("should not add credential to project if not project member", async () => {
    const resProject = await createProject(token);

    expect(resProject.statusCode).toBe(201);
    expect(resProject.body.success).toBe(true);

    const resAddCredential = await addCredential(user2.token, resProject.body.data.project.slug);

    expect(resAddCredential.statusCode).toBe(403);
    expect(resAddCredential.body.message).toBe(messageKeys.PROJECT.PERMISSION.NOT_A_MEMBER);
  });

  it("should remove credential from project", async () => {
    const resProject = await createProject(token);

    expect(resProject.statusCode).toBe(201);
    expect(resProject.body.success).toBe(true);

    const resAddCredential = await addCredential(token, resProject.body.data.project.slug);
    expect(resAddCredential.statusCode).toBe(201);

    const idCredential = resAddCredential.body.data.credential._id;

    const resRemoveCredential = await removeCredential(
      token,
      resProject.body.data.project.slug,
      idCredential
    );

    expect(resRemoveCredential.statusCode).toBe(200);
  });

  it("should edit credential from project", async () => {
    const resProject = await createProject(token);

    expect(resProject.statusCode).toBe(201);
    expect(resProject.body.success).toBe(true);

    const resAddCredential = await addCredential(token, resProject.body.data.project.slug);
    expect(resAddCredential.statusCode).toBe(201);

    const idCredential = resAddCredential.body.data.credential._id;

    const resUpdateCredential = await updateCredential(
      token,
      resProject.body.data.project.slug,
      idCredential
    );

    expect(resUpdateCredential.statusCode).toBe(200);
    expect(resUpdateCredential.body.data.credential.username).toBe("newUser");
  });

  it("should return 400 if send invalid environment", async () => {
    const resProject = await createProject(token);

    expect(resProject.statusCode).toBe(201);
    expect(resProject.body.success).toBe(true);

    const credentialData = {
      credentialData: {
        name: "Dane do panelu admina",
        url: "www.test-page.pl/admin",
        username: "test",
        password: "Test123!",
        environment: "devv",
      } as any,
    };

    const resAddCredential = await addCredential(token, resProject.body.data.project.slug, credentialData);

    expect(resAddCredential.statusCode).toBe(400);
  });

  it("should not edit credential if not project member", async () => {
    const resProject = await createProject(token);
    const resAddCredential = await addCredential(token, resProject.body.data.project.slug);
    const idCredential = resAddCredential.body.data.credential._id;

    const resUpdate = await updateCredential(user2.token, resProject.body.data.project.slug, idCredential);
    expect(resUpdate.statusCode).toBe(403);
  });

  it("should return 404 when credential does not exist", async () => {
    const resProject = await createProject(token);

    const fakeId = "64cfc2abf93e09f6c01e4aa1"; // poprawny ObjectId, ale nie istniejący
    const resDelete = await removeCredential(token, resProject.body.data.project.slug, fakeId);

    expect(resDelete.statusCode).toBe(404);
    expect(resDelete.body.message).toBe(messageKeys.PROJECT_CREDENTIALS.NOT_FOUND);
  });
});
