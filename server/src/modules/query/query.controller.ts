import { Response } from "express";
import { AuthRequest } from "../../shared/middlewares/auth.middleware";
import { askQuestion } from "./query.service";
import { querySchema } from "./query.types";

export const queryDoc = async (req: AuthRequest, res: Response) => {
  try {
    const { question } = querySchema.parse(req.body);

    const result = await askQuestion(question);

    res.json(result);
  } catch (err: any) {
    console.error("QUERY CONTROLLER ERROR:", err);
    res.status(400).json({ message: err.message });
  }
};
