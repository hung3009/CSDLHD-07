import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/Users";

export const register = async (req: Request, res: Response) => {
  try {
    console.log("payload resigster", req.body);
    
    const { email, password, username } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await User.create({ email, password: hashedPassword, username: username, role : "customer" });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Registration failed" + error });
  }
};export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    console.log("payload login", req.body);

    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    // Đặt token vào HttpOnly Cookie
    res.cookie("token", token, {
      httpOnly: true,
      // secure: process.env.NODE_ENV === "production", // Chỉ bật HTTPS trong môi trường production
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // 1 giờ
    });

    return res.status(201).json(user);
  } catch (error) {
    console.log("err", error);
    return res.status(500).json({ error: "Login failed" });
  }
};