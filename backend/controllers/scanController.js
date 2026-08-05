// Prescription scanning logic will go here (Phase 6)
import Tesseract from "tesseract.js";
import Medicine from "../models/Medicine.js";

export const scanPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Run OCR on the uploaded image buffer
    const { data } = await Tesseract.recognize(req.file.buffer, "eng");
    const extractedText = data.text;

    // Split extracted text into words/lines to check against DB
    const words = extractedText
      .split(/\s+/)
      .map((w) => w.replace(/[^a-zA-Z0-9]/g, "").trim())
      .filter((w) => w.length > 2); // ignore very short junk tokens

    // Get all medicines from DB once, then match brand names against extracted words
    const allMedicines = await Medicine.find({});
    const matchedMedicines = [];

    for (const med of allMedicines) {
      const brandWords = med.brandName.toLowerCase().split(/\s+/);
      const firstBrandWord = brandWords[0]; // e.g. "dolo" from "Dolo 650"

      const isMatch = words.some(
        (w) => w.toLowerCase() === firstBrandWord.toLowerCase(),
      );

      if (isMatch) {
        matchedMedicines.push(med.brandName);
      }
    }

    res.json({
      rawText: extractedText,
      matchedMedicines: [...new Set(matchedMedicines)], // remove duplicates
    });
  } catch (err) {
    console.error("Scan error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
