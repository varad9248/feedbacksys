// lib/auth.ts
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { User } from "@/lib/models/user";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function authenticateUser(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    const user = await User.findById(decoded.userId).select("-password");
    return user || null;
  } catch (error) {
    console.error("Authentication Error:", error);
    return null;
  }
}
