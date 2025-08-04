import { prepareUserWithRole } from "@/modules/auth/tests/helpers";
import { addMembers, createProject, setMembers } from "./helpers";
import { USER_POSITION } from "@/constants/enums";
import { ProjectMemberInput } from "@/types/projects/input.type";

jest.mock("@/mail/mail.service");

describe("api/projects/:slug/members", () => {
  let token: string;
  let user1: { token: string; userId: string };
  let user2: { token: string; userId: string };
  let user3: { token: string; userId: string };
  let user4: { token: string; userId: string };
  let user5: { token: string; userId: string };

  beforeEach(async () => {
    user1 = await prepareUserWithRole("user");
    user2 = await prepareUserWithRole("user", "2");
    user3 = await prepareUserWithRole("user", "3");
    user4 = await prepareUserWithRole("user", "4");
    user5 = await prepareUserWithRole("user", "5");

    token = user1.token;
  });

  it("should add member to project", async () => {
    const resProject = await createProject(token);

    expect(resProject.statusCode).toBe(201);
    expect(resProject.body.success).toBe(true);

    const membersData = {
      members: [
        {
          userId: user2.userId,
          position: USER_POSITION[2],
          permissions: {
            canEditProject: true,
          },
        },
      ],
    };

    const resAddMember = await addMembers(token, resProject.body.data.project.slug, membersData);

    expect(resAddMember.statusCode).toBe(201);
    expect(resAddMember.body.data.members[0].user).toBe(user2.userId);
  });

  it("should return 404 if add member to not exists project", async () => {
    const resProject = await createProject(token);

    expect(resProject.statusCode).toBe(201);
    expect(resProject.body.success).toBe(true);

    const membersData = {
      members: [
        {
          userId: user2.userId,
          position: USER_POSITION[2],
          permissions: {
            canEditProject: true,
          },
        },
      ],
    };

    const resAddMembers = await addMembers(token, "invalid-slug", membersData);

    expect(resAddMembers.statusCode).toBe(404);
  });

  it("should replace existing members with new ones", async () => {
    const resProject = await createProject(token);

    const membersData = {
      members: [
        {
          userId: user2.userId,
          position: USER_POSITION[2],
          permissions: {
            canEditProject: true,
          },
        },
      ],
    };

    await addMembers(token, resProject.body.data.project.slug, membersData);

    const setMembersData = {
      members: [
        {
          userId: user3.userId,
          position: USER_POSITION[2],
          permissions: {
            canEditProject: true,
          },
        },
        {
          userId: user4.userId,
          position: USER_POSITION[2],
          permissions: {
            canEditProject: true,
            canEditCredentials: true,
          },
        },
      ],
    } as { members: ProjectMemberInput[] };

    const resSetMembers = await setMembers(token, resProject.body.data.project.slug, setMembersData);
    expect(resSetMembers.statusCode).toBe(200);
    expect(resSetMembers.body.data.members.length).toBe(2);
    expect(resSetMembers.body.data.members[0].user._id).toBe(user3.userId);
    expect(resSetMembers.body.data.members[1].user._id).toBe(user4.userId);
  });

  it("should return 403 if user is not member", async () => {
    const resProject = await createProject(token);

    const membersData = {
      members: [
        {
          userId: user2.userId,
          position: USER_POSITION[2],
          permissions: {
            canEditProject: true,
          },
        },
      ],
    };

    await addMembers(token, resProject.body.data.project.slug, membersData);

    const setMembersData = {
      members: [
        {
          userId: user3.userId,
          position: USER_POSITION[2],
          permissions: {
            canEditProject: true,
          },
        },
        {
          userId: user4.userId,
          position: USER_POSITION[2],
          permissions: {
            canEditProject: true,
            canEditCredentials: true,
          },
        },
      ],
    } as { members: ProjectMemberInput[] };

    const resSetMembers = await setMembers(user5.token, resProject.body.data.project.slug, setMembersData);
    expect(resSetMembers.statusCode).toBe(403);
  });
});
