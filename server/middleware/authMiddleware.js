import { verifyToken } from "../utils/jwt.js";

/**
 * Merr JWT nga:
 * - Authorization: Bearer <token>
 * - ose nga cookie "token" (opsionale)
 */
export function requireAuth(req, res, next) {
  try {
    let token;
    const auth = req.headers.authorization || "";
    if (auth.startsWith("Bearer ")) token = auth.slice(7);
    if (!token && req.cookies?.token) token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "Nuk je i autentikuar." });

    const decoded = verifyToken(token);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: "Sesioni ka skaduar ose token i pavlefshëm." });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role || !roles.includes(role)) {
      return res.status(403).json({ message: "Nuk ke leje për këtë veprim." });
    }
    next();
  };
}
