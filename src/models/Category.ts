import { Schema, model, Document } from "mongoose";
import { IUser } from "./User";

export interface ICategory extends Document {
  name: string;
  type: "income" | "expense";
  userId: IUser["_id"];
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  type: { type: String, enum: ["income", "expense"], required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

export default model<ICategory>("Category", categorySchema);
