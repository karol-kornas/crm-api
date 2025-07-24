import { JWT_EXPIRES_IN, JWT_SECRET } from "@/config";
import { IUser } from "@/types/user";
import jwt from "jsonwebtoken";

export const generateJwt = (user: IUser) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};
