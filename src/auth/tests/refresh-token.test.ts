import { User } from "@/models/user/user.model";
import { loginTestUser, refreshTokenTestUser, verifyEmailTestUser } from "./helpers";
import { advanceBy, clear } from "jest-date-mock";
import { REFRESH_TOKEN_EXPIRATION_MS } from "@/config";
import { messageKeys } from "@/config/messageKeys";

jest.mock("@/mail/mail.service");

describe("POST api/auth/refresh-token", () => {
  it("should return valid refresh token", async () => {
    const res = await verifyEmailTestUser();
    expect(res.body.success).toBe(true);

    const { res: resLogin, cookies } = await loginTestUser();
    expect(resLogin.body.success).toBe(true);

    const email = resLogin.body.data.user.email;
    const user = await User.findByEmail(email);
    const firstToken = user?.refresh_tokens[0].token;

    const resRefresh = await refreshTokenTestUser(cookies);
    const userRefresh = await User.findByEmail(email);
    const secondToken = userRefresh?.refresh_tokens[0].token;

    expect(userRefresh?.refresh_tokens[0].token).toBeTruthy();
    expect(userRefresh?.refresh_tokens[0].expires_at.getTime()).toBeGreaterThan(Date.now());
    expect(firstToken !== secondToken).toBeTruthy();

    expect(resRefresh.headers["set-cookie"]).toBeDefined();
    expect(resRefresh.body.data.token).toBeTruthy();
    expect(resRefresh.statusCode).toBe(200);
    expect(resRefresh.body.success).toBe(true);
  });
  it("should return 401 when no refresh token cookie is provided", async () => {
    const res = await verifyEmailTestUser();
    expect(res.body.success).toBe(true);

    const { res: resLogin } = await loginTestUser();
    expect(resLogin.body.success).toBe(true);

    const resRefresh = await refreshTokenTestUser();

    expect(resRefresh.headers["set-cookie"]).toBeFalsy();
    expect(resRefresh.body.success).toBe(false);
    expect(resRefresh.statusCode).toBe(401);
  });
  it("should return 401 when refresh token cookie not belong to user", async () => {
    const res = await verifyEmailTestUser();
    expect(res.body.success).toBe(true);

    const { res: resLogin, cookies } = await loginTestUser();
    expect(resLogin.body.success).toBe(true);

    const email = resLogin.body.data.user.email;
    const user = await User.findByEmail(email);
    if (user) {
      user.refresh_tokens[0].token = "token-not-belong-to-user";
      await user.save();
    }

    const resRefresh = await refreshTokenTestUser(cookies);

    expect(resRefresh.body.success).toBe(false);
    expect(resRefresh.statusCode).toBe(401);
  });
  it("should return 403 when refresh token is expired", async () => {
    const res = await verifyEmailTestUser();
    expect(res.body.success).toBe(true);

    const { res: resLogin, cookies } = await loginTestUser();
    expect(resLogin.body.success).toBe(true);

    advanceBy(REFRESH_TOKEN_EXPIRATION_MS + 1000);

    const email = resLogin.body.data.user.email;
    const user = await User.findByEmail(email);

    expect(user?.refresh_tokens[0].expires_at.getTime()).toBeLessThan(Date.now());

    const resRefresh = await refreshTokenTestUser(cookies);

    expect(resRefresh.body.success).toBe(false);
    expect(resRefresh.statusCode).toBe(403);
    expect(resRefresh.body.message).toBe(messageKeys.TOKEN.EXPIRED);
    clear();
  });
  it("should reject refresh token if user email is not verified", async () => {
    const res = await verifyEmailTestUser();
    expect(res.body.success).toBe(true);

    const { res: resLogin, cookies } = await loginTestUser();
    expect(resLogin.body.success).toBe(true);

    const email = resLogin.body.data.user.email;
    const user = await User.findByEmail(email);
    expect(user).not.toBeNull();
    if (user) {
      user.is_verified = false;
      await user.save();
    }

    const resRefresh = await refreshTokenTestUser(cookies);

    expect(resRefresh.body.success).toBe(false);
    expect(resRefresh.statusCode).toBe(403);
    expect(resRefresh.body.message).toBe(messageKeys.USER_NOT_VERIFIED);
  });
});
