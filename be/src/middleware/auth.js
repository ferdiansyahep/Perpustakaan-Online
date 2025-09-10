import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const auth = (roles = []) => {
  if (typeof roles === "string") roles = [roles];
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      next();
    } catch {
      res.status(401).json({ error: "Invalid token" });
    }
  };
};
