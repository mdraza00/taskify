import bcrypt from "bcrypt";

export async function generateHashPassword(password: string) {
  return await bcrypt.hash(password, 15);
}

export async function comparePassword(
  hashedPassword: string,
  password: string
) {
  return await bcrypt.compare(password, hashedPassword);
}
