import * as dotenv from "dotenv";
import { sign, verify } from "jsonwebtoken";

dotenv.config();

export function jwtSign(payload: any) {
  return sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
}

export function verifyJWT(token: string) {
  return verify(token, process.env.JWT_SECRET as string);
}
