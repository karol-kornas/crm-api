import { User } from "@/models/user/user.model";
import { loginTestUser, logoutTestUser, registerTestUser, verifyEmailTestUser } from "./helpers";

jest.mock("@/mail/mail.service");

describe("POST api/auth/logout", () => {
  it("should successfully logout a logged-in user and remove refresh token from DB", async () => {
    const res = await verifyEmailTestUser();
    expect(res.body.success).toBe(true);

    const { res: resLogin, cookies } = await loginTestUser();
    expect(resLogin.body.success).toBe(true);

    const email = resLogin.body.data.user.email;
    const user = await User.findByEmail(email);

    expect(user?.refresh_tokens[0].token).toBeTruthy();

    const resLogout = await logoutTestUser(cookies);

    const userAfterLogout = await User.findByEmail(email);
    expect(userAfterLogout?.refresh_tokens).toHaveLength(0);

    expect(resLogout.statusCode).toBe(200);
    expect(resLogout.body.success).toBe(true);
  });
  it("should logout successfully when user is not logged in", async () => {
    const res = await verifyEmailTestUser();
    expect(res.body.success).toBe(true);

    const email = res.body.data.email;
    const user = await User.findByEmail(email);

    expect(user?.refresh_tokens).toHaveLength(0);

    const resLogout = await logoutTestUser();

    expect(resLogout.statusCode).toBe(200);
    expect(resLogout.body.success).toBe(true);
  });
  it("should logout successfully when refresh token is invalid", async () => {
    const res = await verifyEmailTestUser();
    expect(res.body.success).toBe(true);

    const { res: resLogin, cookies } = await loginTestUser();
    expect(resLogin.body.success).toBe(true);

    const email = resLogin.body.data.user.email;
    const user = await User.findByEmail(email);

    if (user && user.refresh_tokens.length > 0) {
      user.refresh_tokens[0].token = "invalid token";
      await user.save();
    }

    const resLogout = await logoutTestUser(cookies);

    const userAfterLogout = await User.findByEmail(email);
    expect(userAfterLogout?.refresh_tokens).toHaveLength(1);

    expect(resLogout.statusCode).toBe(200);
    expect(resLogout.body.success).toBe(true);
  });
});
