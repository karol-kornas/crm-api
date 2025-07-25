import request from "supertest";
import app from "@/app";

export async function registerTestUser() {
  const res = await request(app).post("/api/auth/register").send({
    first_name: "Test",
    last_name: "User",
    email: "test@example.com",
    password: "Password123!",
  });
  return res;
}

export async function verifyEmailTestUser(customToken?: string, registerUser: boolean = true) {
  let token = null;
  if (registerUser) {
    const resRegisterUser = await registerTestUser();
    token = resRegisterUser.body.data.verification_token;
  }
  const res = await request(app).get(`/api/auth/verify-email?token=${customToken ?? token}`);

  return res;
}

export async function loginTestUser(email: string = "test@example.com", password: string = "Password123!") {
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
