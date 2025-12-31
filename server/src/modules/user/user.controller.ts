import { Request, Response } from "express";
import { registerSchema, loginSchema } from "./user.types";
import { registerUser, loginUser } from "./user.service";

export const register = async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);
  const user = await registerUser(data);
  res.json(user);
};

export const login = async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);
  const token = await loginUser(data.email, data.password);
  res.json({ token });
};
