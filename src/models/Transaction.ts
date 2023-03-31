import { Schema, model, Document } from "mongoose";
import { ICategory } from "./Category";
import { IAccount } from "./Account";
import { IUser } from "./User";

export interface ITransaction extends Document {
  type: string;
  amount: number;
  category: ICategory["_id"];
  account: IAccount["_id"];
  date: Date;
  note: string;
  userId: IUser["_id"];
  metadata: Map<string, any>;
}

const transactionSchema = new Schema<ITransaction>({
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  account: { type: Schema.Types.ObjectId, ref: "Account", required: true },
  date: { type: Date, default: Date.now },
  note: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  metadata: { type: Map, of: Schema.Types.Mixed },
});

transactionSchema.statics.getAllByAccount = async function (
  accountId: IAccount["_id"]
): Promise<ITransaction[]> {
  const transactions = await this.find({ account: accountId }).populate(
    "category account"
  );
  return transactions;
};

export default model<ITransaction>("Transaction", transactionSchema);
