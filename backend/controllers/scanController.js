import Tesseract from "tesseract.js";
import prisma from "../config/db.js";

export const scanPrescription = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const { data } = await Tesseract.recognize(req.file.buffer, "eng");
    const extractedText = data.text;

    const words = extractedText
      .split(/\s+/)
      .map((w) => w.replace(/[^a-zA-Z0-9]/g, "").trim())
      .filter((w) => w.length > 2);

    const allMedicines = await prisma.medicine.findMany();
    const matchedMedicines = [];

    for (const med of allMedicines) {
      const brandWords = med.brandName.toLowerCase().split(/\s+/);
      const firstBrandWord = brandWords[0];

      const isMatch = words.some(
        (w) => w.toLowerCase() === firstBrandWord.toLowerCase(),
      );

      if (isMatch) {
        matchedMedicines.push(med.brandName);
      }
    }

    res.json({
      rawText: extractedText,
      matchedMedicines: [...new Set(matchedMedicines)],
    });
  } catch (err) {
    console.error("Scan error:", err.message);
    res.status(500).json({ message: err.message });
  }
};
