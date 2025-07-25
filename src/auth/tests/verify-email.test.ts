import { User } from "@/models/user/user.model";
import { verifyEmailTestUser } from "./helpers";
import { messageKeys } from "@/config/messageKeys";

jest.mock("@/mail/mail.service");

describe("GET api/auth/verify-email", () => {
  it("should verification email and verify user", async () => {
    const res = await verifyEmailTestUser();
    expect(res.body.success).toBe(true);
    expect(res.statusCode).toBe(200);

    const user = await User.findByEmail(res.body.data.email);
    expect(user?.is_verified).toBe(true);
  });

  it("should return 401 if token is invalid", async () => {
    const invalidToken = "invalid-token";
    const res = await verifyEmailTestUser(invalidToken);

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(messageKeys.TOKEN.INVALID);
  });

  it("should return 401 if token has already been used", async () => {
    const firstRes = await verifyEmailTestUser();
    expect(firstRes.statusCode).toBe(200);

    const firstResToken = firstRes.body.data.verification_token;

    const secondRes = await verifyEmailTestUser(firstResToken, false);
    expect(secondRes.statusCode).toBe(401);
    expect(secondRes.body.success).toBe(false);
    expect(secondRes.body.message).toBe(messageKeys.TOKEN.INVALID);
  });
});
