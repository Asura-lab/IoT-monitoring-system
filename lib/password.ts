import bcrypt from "bcryptjs";
export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}
