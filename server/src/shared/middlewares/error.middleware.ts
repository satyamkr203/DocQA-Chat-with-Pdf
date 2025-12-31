import { Request, Response, NextFunction } from "express";
import { ApiError } from "../errors/ApiError";
import multer from "multer";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("🔥 ERROR HANDLER:", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    contentType: req.headers["content-type"],
  });

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ 
        message: "File too large. Maximum size is 5MB" 
      });
    }
    if (err.message === "Field name missing" || err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ 
        message: "Invalid file upload. Please send the file with field name 'file' as multipart/form-data" 
      });
    }
    return res.status(400).json({ 
      message: `File upload error: ${err.message}` 
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ message: err.message });
  }
  return res.status(500).json({ message: "Internal Server Error" });
};
