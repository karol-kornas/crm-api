import request from "supertest";
import app from "@/app";
import { User } from "@/models/user/user.model";
import { Role } from "@/constants/enums";

export async function registerTestUser(role: Role = "client", id: string = "1") {
  const res = await request(app)
    .post("/api/auth/register")
    .send({
      first_name: "Test",
      last_name: "User",
      email: `test-${id}-${role}@example.com`,
      password: "Password123!",
    });
  return res;
}

export async function verifyEmailTestUser(
  role: Role = "client",
  customToken?: string,
  registerUser: boolean = true,
  id: string = "1"
) {
  let token = null;
  if (registerUser) {
    const resRegisterUser = await registerTestUser(role, id);
    token = resRegisterUser.body.data.user.email_verification_token;
  }
  const res = await request(app).get(`/api/auth/verify-email?token=${customToken ?? token}`);

  return res;
}

export async function loginTestUser(email: string = "test-1-client@example.com", password: string = "Password123!") {
  const res = await request(app).post("/api/auth/login").send({
    email,
    password,
  });
  const cookies = Array.isArray(res.headers["set-cookie"]) ? res.headers["set-cookie"] : [];
  return {
    res,
    cookies,
    accessToken: res.body.data?.accessToken,
    user: res.body.data?.user,
  };
}

export async function logoutTestUser(cookies?: string[]) {
  const req = request(app).post("/api/auth/logout");
  if (cookies) req.set("Cookie", cookies);
  return req;
}

export async function refreshTokenTestUser(cookies?: string[]) {
  const req = request(app).post("/api/auth/refresh-token");
  if (cookies) req.set("Cookie", cookies);
  return req;
}

export async function requestPasswordReset(email: string) {
  const res = request(app).post("/api/auth/request-password-reset").send({
    email,
  });
  return res;
}

export async function resetPassword(token: string, password: string) {
  const res = request(app).post("/api/auth/reset-password").send({
    token,
    password,
  });
  return res;
}

export function printResponse(res: request.Response) {
  console.log("STATUS:", res.statusCode);
  console.log("BODY:", JSON.stringify(res.body, null, 2));
}

export const prepareUserWithRole = async (role: Role = "user", id: string = "1") => {
  const res = await verifyEmailTestUser(role, undefined, true, id);
  const user = await User.findByEmail(res.body.data.user.email);

  if (!user) throw new Error("Test user not found");

  user.role = role;
  await user.save();

  const { res: resLogin } = await loginTestUser(`test-${id}-${role}@example.com`, "Password123!");
  return {
    token: resLogin.body.data.accessToken,
    userId: resLogin.body.data.user._id,
  };
};
