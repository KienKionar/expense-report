// lib/auth.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretbanget"; // ganti di produksi!

export function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export const comparePassword = async (plain: string, hash: string) => {
  return await bcrypt.compare(plain, hash);
};

export function generateToken(payload: {
  id: number;
  name: string;
  email: string;
}) {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "7d", // bebas mau 1h/1d/7d
  });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
