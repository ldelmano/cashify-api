import { Request, Response, NextFunction } from "express";
import { RequestWithUser } from "../types/RequestWithUser";
import { getUserIdFromToken } from "../utils/auth";
import { expressjwt } from "express-jwt";

const SECRET = process.env.JWT_SECRET as string;

export const authenticate = expressjwt({
  secret: SECRET,
  algorithms: ["HS256"],
});

export const getUser = (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");
  if (authHeader) {
    const token = authHeader.replace("Bearer ", "");
    const userId = getUserIdFromToken(token);
    if (userId) {
      req.userId = userId;
    }
  }
  next();
};
