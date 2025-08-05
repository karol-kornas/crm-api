import { IUser } from "./model.type";

export interface TokensAndUser {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}
