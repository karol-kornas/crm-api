import { registerTestUser } from "./helpers";

jest.mock("@/mail/mail.service");

describe("POST api/auth/register", () => {
  it("should register a new user", async () => {
    const res = await registerTestUser();

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.verification_token).toBeTruthy();
    expect(res.body.data.email).toBe("test@example.com");
    expect(res.body.data.is_verified).toBe(false);
  });
});
