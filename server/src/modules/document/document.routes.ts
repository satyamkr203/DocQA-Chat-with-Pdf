import { Router } from "express";
import { uploadPdf } from "./document.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { upload } from "../../shared/middlewares/upload.middleware";

const router = Router();

router.post("/upload", authMiddleware ,upload.single("file"), uploadPdf);

export default router;
