import { auth } from "../services/firebase.service.js";

export async function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing Authorization header" });
    }

    const token = header.split(" ")[1];

    const decoded = await auth.verifyIdToken(token);

    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      tenantId: decoded.tenantId || null,
    };

    next();
  } catch (err) {
    console.error("AUTH MIDDLEWARE ERROR", err);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
