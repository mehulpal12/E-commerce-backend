// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import {User} from "../models/user.model.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      // Extract token
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      // Get user data (without password)
      req.user = await User.findById(decoded.id).select("-password");

      // Continue to next middleware or controller
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, invalid token1" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token2" });
  }
};
