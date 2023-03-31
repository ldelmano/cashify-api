import { Response } from "express";
import Transaction from "../models/Transaction";
import { RequestWithUser } from "../types/RequestWithUser";
import User, { IUser } from "../models/User";
import Account from "../models/Account";

class TransactionController {
  async getAll(req: RequestWithUser, res: Response) {
    try {
      const userId = req.userId;
      const user: IUser | null = await User.findById(userId);
      let transactions;

      if (user?.role === "super-admin" || user?.role === "admin") {
        transactions = await Transaction.find().populate("category account");
      } else {
        const accounts = await Account.find({ userId });
        const accountIds = accounts.map((account) => account._id);

        transactions = await Transaction.find({
          account: { $in: accountIds },
          $or: [{ userId }, { managerId: userId }],
        }).populate("category account");
      }

      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching transactions" });
    }
  }

  async getAllByAccount(req: RequestWithUser, res: Response) {
    try {
      const userId = req.userId;
      const accountId = req.params.accountId;
      const transactions = await Transaction.find({
        userId,
        account: accountId,
      }).populate("category account");
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Error fetching transactions" });
    }
  }

  async create(req: RequestWithUser, res: Response) {
    try {
      const { type, amount, category, account, date, note, metadata } =
        req.body;
      const userId = req.userId;

      const transaction = new Transaction({
        type,
        amount,
        category,
        account,
        date,
        note,
        userId,
        metadata,
      });
      await transaction.save();

      res.status(201).json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Error creating transaction" });
    }
  }

  async update(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;
      const { type, amount, category, account, date, note, metadata } =
        req.body;
      const userId = req.userId;

      const transaction = await Transaction.findOneAndUpdate(
        { _id: id, userId },
        { type, amount, category, account, date, note, metadata }, // Update the metadata field
        { new: true }
      );

      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: "Error updating transaction" });
    }
  }

  async delete(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const transaction = await Transaction.findOneAndDelete({
        _id: id,
        userId,
      });

      if (!transaction) {
        return res.status(404).json({ message: "Transaction not found" });
      }

      res.json({ message: "Transaction deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting transaction" });
    }
  }
}

export default new TransactionController();
