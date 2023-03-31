import { Response, NextFunction } from "express";
import { RequestWithUser } from "../types/RequestWithUser";
import User, { IUser } from "../models/User";
import Role from "../constants/roles";

const roleMiddleware = (roles: Role[]) => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.userId);

      if (!user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (user.role === Role.SUPER_ADMIN) {
        next();
      } else if (!roles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden" });
      } else {
        next();
      }
    } catch (error) {
      res.status(500).json({ message: "Error checking user role" });
    }
  };
};

export default roleMiddleware;
