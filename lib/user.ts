import User from "@/models/User";
import { connectDB } from "./db";

export async function getUserByEmail(email: string) {
  await connectDB();
  return User.findOne({ email });
}
