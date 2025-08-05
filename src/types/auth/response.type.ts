import { IUser } from "./model.type";

export interface UserResponse {
  success: boolean;
  message: string;
  data: {
    user: IUser;
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: IUser;
  };
}
