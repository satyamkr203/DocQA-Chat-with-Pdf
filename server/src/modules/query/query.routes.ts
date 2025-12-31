import { Router } from "express";
import { queryDoc } from "./query.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, queryDoc);

export default router;
