import app from "@/app";
import { User } from "@/models/user/user.model";
import { registerTestUser, verifyEmailTestUser } from "./helpers";
import request from "supertest";

jest.mock("@/mail/mail.service");

describe("GET api/auth/resend-verify-email", () => {
  it("should resend verification email and verify user", async () => {
    const res = await registerTestUser();
    expect(res.body.success).toBe(true);
    const email = res.body.data.user.email;

    const resendVerifyRes = await request(app).get(`/api/auth/resend-verify-email?email=${email}`);
    expect(resendVerifyRes.statusCode).toBe(200);
    expect(resendVerifyRes.body.success).toBe(true);

    const token = resendVerifyRes.body.data?.user.email_verification_token;
    expect(token).toBeTruthy();
    const verifyRes = await verifyEmailTestUser("client", token!, false);
    expect(verifyRes.statusCode).toBe(200);
    expect(verifyRes.body.success).toBe(true);

    const updatedUser = await User.findOne({ email });
    expect(updatedUser?.is_verified).toBe(true);
  });
});
