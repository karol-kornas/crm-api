import { User } from "@/models/user/user.model";
import { requestPasswordReset, verifyEmailTestUser } from "./helpers";
import { messageKeys } from "@/config/message-keys";

jest.mock("@/mail/mail.service");

describe("POST api/auth/request-password-reset", () => {
  it("should return 200 and set token for user", async () => {
    const res = await verifyEmailTestUser();
    expect(res.body.success).toBe(true);

    const email = res.body.data.user.email;
    const resRequestPasswordReset = await requestPasswordReset(email);

    const user = await User.findByEmail(email);
    expect(user).toBeDefined();
    if (user) {
      expect(user.password_reset_token).toBeTruthy();
      expect(user.password_reset_token_expires).toBeTruthy();
    }

    expect(resRequestPasswordReset.statusCode).toBe(200);
  });
  it("should return 404 if email not existing", async () => {
    const res = await requestPasswordReset("not-existing@email.com");

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe(messageKeys.USER_NOT_FOUND);
  });
});
