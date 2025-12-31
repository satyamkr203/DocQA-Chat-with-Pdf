import { Router } from "express";
import userRoutes from "./modules/user/user.routes";
import documentRoutes from "./modules/document/document.routes";
import queryRoutes from "./modules/query/query.routes";

const router = Router();

router.use("/auth", userRoutes);
router.use("/documents", documentRoutes);
router.use("/query", queryRoutes);
router.get("/check", (_, res) => {
  res.send("ok");
});

export default router;
