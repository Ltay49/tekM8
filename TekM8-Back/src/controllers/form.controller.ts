import { Request, Response } from "express";
import { fillFormImage } from "../models/form-filler.model";
import { convertPdfToImage } from "../utils/pdf-to-image";

export const handleFormFill = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const pdfPath = req.file?.path;

    console.log("📥 Received file:", req.file);
    console.log("🧾 User details:", req.body.userDetails);
    console.log("✅ Checked items:", req.body.checkedItems);

    if (!pdfPath || typeof pdfPath !== "string") {
      res.status(400).json({ error: "Missing uploaded PDF file" });
      return;
    }

    const imagePath = await convertPdfToImage(pdfPath);

    if (!imagePath || typeof imagePath !== "string") {
      res.status(500).json({ error: "PDF to image conversion failed" });
      return;
    }

    let userDetails, checkedItems;
    try {
      userDetails = JSON.parse(req.body.userDetails);
      checkedItems = JSON.parse(req.body.checkedItems);
    } catch (error) {
      res
        .status(400)
        .json({ error: "Invalid JSON in userDetails or checkedItems" });
      return;
    }

    const filledPath = await fillFormImage(
      imagePath,
      userDetails,
      checkedItems
    );
    res.json({ filledPath });
  } catch (error) {
    console.error("❌ Form fill failed:", error);
    res.status(500).json({ error: "Failed to fill form" });
  }
};
