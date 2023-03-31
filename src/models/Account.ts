import { Schema, model, Document } from "mongoose";
import { IUser } from "./User";

export interface IAccount extends Document {
  name: string;
  initialBalance: number;
  currentBalance: number;
  userId: IUser["_id"];
  managers?: string[];
}

const accountSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  initialBalance: { type: Number, required: true },
  currentBalance: { type: Number, required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  managers: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

export default model<IAccount>("Account", accountSchema);
