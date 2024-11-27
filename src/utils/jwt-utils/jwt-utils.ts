import * as dotenv from "dotenv";
import { sign, verify } from "jsonwebtoken";
import { IJWTPayload } from "../../interfaces/jwtPayload";

dotenv.config();

export function jwtSign(payload: any) {
  return sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
}

export function jwtVerify(token: string): IJWTPayload | null {
  try {
    const payload: any = verify(token, process.env.JWT_SECRET as string);
    return payload;
  } catch (err) {
    console.error("JWT Token is not valid");
    return null;
  }
}
