import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET as string;
  const token = jwt.sign({ userId }, secret, { expiresIn: "7d" });
  return token;
};

export const getUserIdFromToken = (token: string) => {
  const secret = process.env.JWT_SECRET as string;
  try {
    const decoded = jwt.verify(token, secret) as { userId: string };
    return decoded.userId;
  } catch (error) {
    return null;
  }
};
