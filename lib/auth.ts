import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

// Updated payload type to JWTPayload
export const generateToken = async (payload: JWTPayload) => {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(SECRET);
};

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload;
  } catch (error) {
    console.error("JWT verification failed", error);
    throw error;
  }
};
