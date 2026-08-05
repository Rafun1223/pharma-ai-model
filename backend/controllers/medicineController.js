import prisma from "../config/db.js";

export const getMedicineByName = async (req, res) => {
  try {
    const med = await prisma.medicine.findFirst({
      where: {
        brandName: { contains: req.params.name, mode: "insensitive" },
      },
    });
    if (!med) return res.status(404).json({ message: "Medicine not found" });
    res.json(med);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAlternatives = async (req, res) => {
  try {
    const med = await prisma.medicine.findFirst({
      where: {
        brandName: { contains: req.params.name, mode: "insensitive" },
      },
    });
    if (!med) return res.status(404).json({ message: "Medicine not found" });

    const alternatives = await prisma.medicine.findMany({
      where: {
        composition: med.composition,
        id: { not: med.id },
      },
      orderBy: { price: "asc" },
    });

    res.json({ original: med, alternatives });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
