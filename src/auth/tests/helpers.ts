import request from "supertest";
import app from "@/app";
import { User } from "@/models/user/user.model";
import { Role } from "@/constants/enums";

export async function registerTestUser(role: Role = "client") {
  const res = await request(app)
    .post("/api/auth/register")
    .send({
      first_name: "Test",
      last_name: "User",
      email: `test-${role}@example.com`,
      password: "Password123!",
    });
  return res;
}

export async function verifyEmailTestUser(role: Role = "client", customToken?: string, registerUser: boolean = true) {
  let token = null;
  if (registerUser) {
    const resRegisterUser = await registerTestUser(role);
    token = resRegisterUser.body.data.verification_token;
  }
  const res = await request(app).get(`/api/auth/verify-email?token=${customToken ?? token}`);

  return res;
}

export async function loginTestUser(email: string = "test-client@example.com", password: string = "Password123!") {
  const res = await request(app).post("/api/auth/login").send({
    email,
    password,
  });
  const cookies = Array.isArray(res.headers["set-cookie"]) ? res.headers["set-cookie"] : [];
  return {
    res,
    cookies,
    token: res.body.data?.token,
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

export const prepareUserWithRole = async (role: Role = "user") => {
  const res = await verifyEmailTestUser(role);
  const user = await User.findByEmail(res.body.data.email);

  if (!user) throw new Error("Test user not found");

  user.role = role;
  await user.save();

  const { res: resLogin } = await loginTestUser(`test-${role}@example.com`, "Password123!");
  return resLogin.body.data.token;
};
