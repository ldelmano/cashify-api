import { Request, Response } from "express";
import User, { IUser } from "../models/User";
import { generateToken } from "../utils/auth";
import { RequestWithUser } from "../types/RequestWithUser";
import Account from "../models/Account";

class UserController {
  async signUp(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email already exists." });
      }

      const user: IUser = new User({ email, password });
      await user.save();

      const token = generateToken(user._id);

      const userObject = user.toObject();

      // Remove the password property from the user object
      delete userObject.password;

      res.status(201).json({ token, user: userObject });
    } catch (error) {
      res.status(500).json({ message: "Error creating user" });
    }
  }

  async logIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = await user.comparePassword(password);

      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }

      const token = generateToken(user._id);
      res.json({ token, user });
    } catch (error) {
      res.status(500).json({ message: "Error logging in" });
    }
  }

  async delete(req: RequestWithUser, res: Response) {
    try {
      // Only admin users can delete user accounts
      const requestingUser = await User.findById(req.userId);
      if (!requestingUser || requestingUser.role !== "admin") {
        return res
          .status(403)
          .json({ message: "You are not authorized to perform this action" });
      }

      const { id } = req.params;
      const user = await User.findOneAndDelete({ _id: id });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User account deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting user" });
    }
  }

  async update(req: RequestWithUser, res: Response) {
    try {
      const user: IUser | null = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Only admin users can update user accounts
      const requestingUser = await User.findById(req.userId);
      if (!requestingUser || requestingUser.role !== "admin") {
        return res
          .status(403)
          .json({ message: "You are not authorized to perform this action" });
      }

      const { email, password } = req.body;

      user.email = email || user.email;
      user.password = password || user.password;

      const updatedUser = await user.save();

      const userObject = updatedUser.toObject();

      // Remove the password property from the user object
      delete userObject.password;

      res.json({
        message: "User account updated successfully",
        user: userObject,
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating user" });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const { email, password, role, accountId } = req.body;
      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User with this email already exists." });
      }

      const user: IUser = new User({ email, password, role });
      if (role === "manager") {
        const account = await Account.findByIdAndUpdate(
          accountId,
          { $push: { managers: user._id } }, // Add the new user's ID to the managers array of the account
          { new: true }
        );
        if (!account) {
          return res.status(404).json({ message: "Account not found" });
        }
      }
      await user.save();

      const userObject = user.toObject();

      // Remove the password property from the user object
      delete userObject.password;

      res.status(201).json({ user: userObject });
    } catch (error) {
      res.status(500).json({ message: "Error creating user" });
    }
  }
}

export default new UserController();
