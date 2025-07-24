import { MAX_LOGIN_ATTEMPTS } from "@/config";
import { loginTestUser, registerTestUser, verifyEmailTestUser } from "./helpers";
import { advanceBy, clear } from "jest-date-mock";

jest.mock("@/mail/mail.service");

describe("POST api/auth/login", () => {
  it("should log in user", async () => {
    const res = await verifyEmailTestUser();

    expect(res.body.success).toBe(true);

    const { res: resLogin } = await loginTestUser();

    expect(resLogin.body.success).toBe(true);
  });
  it("should return 401 if invalid credentials", async () => {
    const res = await verifyEmailTestUser();

    expect(res.body.success).toBe(true);

    const { res: resLogin } = await loginTestUser("test@example.com", "invalid_password");

    expect(resLogin.body.success).toBe(false);
    expect(resLogin.statusCode).toBe(401);
  });
  it("should return 403 if email not verified", async () => {
    const res = await registerTestUser();

    expect(res.statusCode).toBe(201);

    const { res: resLogin } = await loginTestUser();

    expect(resLogin.body.success).toBe(false);
    expect(resLogin.statusCode).toBe(403);
  });
  it("should return 403 if max login attempts becouse locked account", async () => {
    const res = await verifyEmailTestUser();
    expect(res.body.success).toBe(true);

    for (let i = 0; i <= MAX_LOGIN_ATTEMPTS; i++) {
      await loginTestUser("test@example.com", "invalid_password");
    }
    const { res: resLogin } = await loginTestUser();

    expect(resLogin.body.success).toBe(false);
    expect(resLogin.statusCode).toBe(403);
  });
  it("should reset login attempts if success login", async () => {
    const res = await verifyEmailTestUser();

    expect(res.body.success).toBe(true);

    for (let i = 0; i <= 2; i++) {
      await loginTestUser("test@example.com", "invalid_password");
    }
    const { res: resLogin } = await loginTestUser();

    expect(resLogin.body.success).toBe(true);
    expect(resLogin.body.data.user.login_attempts).toBe(0);
  });
  it("should allow login after account lock expires", async () => {
    const res = await verifyEmailTestUser();
    expect(res.body.success).toBe(true);

    for (let i = 0; i <= MAX_LOGIN_ATTEMPTS; i++) {
      await loginTestUser("test@example.com", "invalid_password");
    }
    const { res: resBlocked } = await loginTestUser();

    expect(resBlocked.body.success).toBe(false);
    expect(resBlocked.statusCode).toBe(403);

    advanceBy(16 * 60 * 1000); // 16min

    const { res: resLoginAfter } = await loginTestUser();

    expect(resLoginAfter.body.success).toBe(true);
    expect(resLoginAfter.statusCode).toBe(200);

    clear();
  });
});
