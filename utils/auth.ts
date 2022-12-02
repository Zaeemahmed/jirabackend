import * as jwt from "jsonwebtoken";

export interface AuthTokenPayload {
  userId: string;
}

export function decodeAuthHeader(authHeader: String): AuthTokenPayload {
  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    throw new Error("User must be Authenticated");
  }
  return jwt.verify(token, process.env.JWT_SECRET as string) as AuthTokenPayload;
}
