import { Schema, model, Document } from "mongoose";
import bcrypt from "bcrypt";
import Role from "../constants/roles";

export interface IUser extends Document {
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
  role: Role;
}

const UserSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(Role),
    default: Role.ADMIN,
  },
});

UserSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

UserSchema.methods.comparePassword = async function (
  this: IUser,
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default model<IUser>("User", UserSchema);
