import jwt from "jsonwebtoken";

export function signToken(payload, options = {}) {
  const secret = process.env.JWT_SECRET;
  return jwt.sign(payload, secret, { expiresIn: "7d", ...options });
}

export function verifyToken(token) {
  const secret = process.env.JWT_SECRET;
  return jwt.verify(token, secret);
}
