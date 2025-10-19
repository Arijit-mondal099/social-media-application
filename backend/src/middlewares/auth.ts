import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";

export interface AuthRequest extends Request {
  user?: {
    _id: string;
    name: string;
    username: string;
    email: string;
  };
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token =
      req.cookies?.token ||
      req.headers["authorization"]?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user token not provided or invalid!",
      });
    }

    const decodeToken = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload & { id: string };
    const user = await User.findById(decodeToken?.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user token not provided or invalid!",
      });
    }

    (req as AuthRequest).user = {
      _id: String(user._id),
      name: user.name,
      email: user.email,
      username: user.username,
    };

    return next();
  } catch (error) {
    console.log("Auth Error", error);
    return res.status(401).json({
      success: false,
      message: "Unauthorized user token not provided or invalid!",
    });
  }
};
