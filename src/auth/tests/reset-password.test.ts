import { User } from "@/models/user/user.model";
import { requestPasswordReset, resetPassword, verifyEmailTestUser } from "./helpers";

jest.mock("@/mail/mail.service");

describe("POST api/auth/reset-password", () => {
  it("should return 200 and set new password", async () => {
    const res = await verifyEmailTestUser();
    expect(res.body.success).toBe(true);

    const email = res.body.data.email;
    const resRequestPasswordReset = await requestPasswordReset(email);

    const user = await User.findByEmail(email);
    expect(user).toBeDefined();
    if (user) {
      const token = user.reset_password_token;
      const token_expires = user.reset_password_token_expires;
      expect(token).toBeTruthy();
      expect(token_expires).toBeTruthy();
      expect(resRequestPasswordReset.statusCode).toBe(200);
      if (token) {
        const resResetPassword = await resetPassword(token, "NewPassword123!");

        expect(resResetPassword.statusCode).toBe(200);
      }
    }
  });
  it("should return 401 if token invalid", async () => {
    const res = await verifyEmailTestUser();
    expect(res.body.success).toBe(true);

    const email = res.body.data.email;
    const resRequestPasswordReset = await requestPasswordReset(email);
    expect(resRequestPasswordReset.statusCode).toBe(200);

    const resResetPassword = await resetPassword("invalidToken", "NewPassword123!");
    expect(resResetPassword.statusCode).toBe(401);
  });
});
