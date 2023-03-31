import { Response } from "express";
import Category from "../models/Category";
import { RequestWithUser } from "../types/RequestWithUser";

class CategoryController {
  async getAll(req: RequestWithUser, res: Response) {
    try {
      const userId = req.userId;
      const categories = await Category.find({ userId });
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Error fetching categories" });
    }
  }

  async create(req: RequestWithUser, res: Response) {
    try {
      const { name, type } = req.body;
      const userId = req.userId;

      const category = new Category({ name, type, userId });
      await category.save();

      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: "Error creating category" });
    }
  }

  async update(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;
      const { name, type } = req.body;
      const userId = req.userId;

      const category = await Category.findOneAndUpdate(
        { _id: id, userId },
        { name, type },
        { new: true }
      );

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Error updating category" });
    }
  }

  async delete(req: RequestWithUser, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.userId;

      const category = await Category.findOneAndDelete({ _id: id, userId });

      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json({ message: "Category deleted" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting category" });
    }
  }
}

export default new CategoryController();
