import { Router } from "express";
import { register, login } from "../controllers/auth.controller";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", (req, res) => {
    console.log("in me route");
    
    const token = req.cookies.token; // Lấy token từ cookie

    console.log("token req ", token);
    
  
    if (!token) {
      return res.status(401).json({ authenticated: false });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      return res.json({ authenticated: true, user: decoded });
    } catch (err) {
      return res.status(403).json({ authenticated: false });
    }
  });

  router.post("/logout", (req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "strict" });
    return res.status(200).json({ message: "Logged out successfully" });
  });

  
export default router;
