import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./shared/middlewares/error.middleware";

const app = express();

app.use(
  cors({
    origin: [
      "https://doc-qa-chat-with-pdf.vercel.app", // Vercel frontend
      "http://localhost:5173"                    // local dev
    ],
    credentials: true,
  })
);

app.use(express.json());

app.use((req, _res, next) => {
  console.log("calling api => :", {
    method: req.method,
    url: req.url,
    contentType: req.headers["content-type"],
    hasAuth: !!req.headers.authorization,
  });
  next();
});

app.use("/api", routes);

app.use(errorHandler);

export default app;
