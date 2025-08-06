import { registerTestUser } from "./helpers";

jest.mock("@/mail/mail.service");

describe("POST api/auth/register", () => {
  it("should register a new user", async () => {
    const res = await registerTestUser();

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.emailVerificationToken).toBeTruthy();
    expect(res.body.data.user.email).toBe("test-1-client@example.com");
    expect(res.body.data.user.isVerified).toBe(false);
  });
  it("should return 409 when email already exists", async () => {
    const res = await registerTestUser();

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);

    const resSecond = await registerTestUser();

    expect(resSecond.statusCode).toBe(409);
    expect(resSecond.body.success).toBe(false);
  });
});
