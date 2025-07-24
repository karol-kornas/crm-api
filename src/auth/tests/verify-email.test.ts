import { User } from "@/models/user/user.model";
import { registerTestUser, verifyEmailTestUser } from "./helpers";

jest.mock("@/mail/mail.service");

describe("GET api/auth/verify-email", () => {
  it("should verification email and verify user", async () => {
    const res = await verifyEmailTestUser();
    expect(res.body.success).toBe(true);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);

    const updatedUser = await User.findOne({ email: res.body.data.email });
    expect(updatedUser?.is_verified).toBe(true);
  });

  it("should return 400 if token is invalid", async () => {
    const invalidToken = "invalid-token";
    const res = await verifyEmailTestUser(invalidToken);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.messageKey).toBe("auth.verify_email.invalid_or_expired");
  });

  it("should return 400 if token has already been used", async () => {
    const firstRes = await verifyEmailTestUser();
    expect(firstRes.statusCode).toBe(200);

    const firstResToken = firstRes.body.data.verification_token;

    const secondRes = await verifyEmailTestUser(firstResToken, false);
    expect(secondRes.statusCode).toBe(400);
    expect(secondRes.body.success).toBe(false);
    expect(secondRes.body.messageKey).toBe("auth.verify_email.invalid_or_expired");
  });
});
