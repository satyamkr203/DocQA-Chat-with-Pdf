import { Response } from "express";
import { AuthRequest } from "../../shared/middlewares/auth.middleware";
import { createDocument } from "./document.service";
import PdfParse from "pdf-parse";

export const uploadPdf = async (req: AuthRequest, res: Response) => {
  try {

    if (!req.file) {
      console.log("NO FILE");
      return res.status(400).json({ message: "PDF file required" });
    }

    const pdfData = await PdfParse(req.file.buffer);

    const text = pdfData.text?.trim();

    if (!text) {
      return res.status(400).json({ message: "No text found in PDF" });
    }

    const doc = await createDocument(req.userId!, text);

    res.json({
      message: "PDF uploaded & indexed",
      documentId: doc.id
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
