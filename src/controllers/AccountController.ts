import { Response } from "express";
import Account from "../models/Account";
import { RequestWithUser } from "../types/RequestWithUser";

class AccountController {
  async getAll(req: RequestWithUser, res: Response) {
    try {
      const userId = req.userId;
      const accounts = await Account.find({ userId });
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: "Error fetching accounts" });
    }
  }

  async create(req: RequestWithUser, res: Response) {
    try {
      const { name } = req.body;
      const userId = req.userId;

      const account = new Account({ name, userId });
      await account.save();

      res.status(201).json(account);
    } catch (error) {
      res.status(500).json({ message: "Error creating account" });
    }
  }

  async update(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const userId = req.userId;

      const account = await Account.findOneAndUpdate(
        { _id: id, userId },
        { name },
        { new: true }
      );

      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      res.json(account);
    } catch (error) {
      res.status(500).json({ message: "Error updating account" });
    }
  }

  async delete(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const account = await Account.findOneAndDelete({ _id: id, userId });

      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }

      res.json({ message: "Account deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting account" });
    }
  }
}

export default new AccountController();
