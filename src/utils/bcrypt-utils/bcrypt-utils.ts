import bcrypt from "bcrypt";

export async function encryptPassword(password: string) {
  return await bcrypt.hash(password, 15);
}

export async function co