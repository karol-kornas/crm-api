import { LoginInput, RegisterInput, RequestPasswordResetInput, ResetPasswordInput } from "./input.type";

export interface RegisterParams {
  userData: RegisterInput;
}

export interface VerifyEmailParams {
  token: string;
}

export interface ResendVerifyEmailParams {
  email: string;
}

export interface LoginParams {
  userCredential: LoginInput;
}

export interface RefreshTokenParams {
  token: string;
}

export interface RequestPasswordResetParams {
  userData: RequestPasswordResetInput;
}

export interface RequestPasswordResetParams {
  userData: RequestPasswordResetInput;
}

export interface ResetPasswordParams {
  userData: ResetPasswordInput;
}
