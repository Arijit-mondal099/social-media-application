import jwt, { Secret, SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as Secret;
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || "1d") as SignOptions["expiresIn"];

export interface IJwtPayload {
  id: string;
  email: string;
}

export const generateToken = (payload: IJwtPayload): string | null => {
  try {
    const options: SignOptions = {
      expiresIn: JWT_EXPIRES_IN,
    };

    const token = jwt.sign(payload, JWT_SECRET, options);
    return token;
  } catch (error) {
    console.error("Generate token error", error);
    return null;
  }
};
