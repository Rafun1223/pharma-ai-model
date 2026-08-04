import Medicine from "../models/Medicine.js";

export const getMedicineByName = async (req, res) => {
  try {
    const med = await Medicine.findOne({
      brandName: { $regex: req.params.name, $options: "i" },
    });
    if (!med) return res.status(404).json({ message: "Medicine not found" });
    res.json(med);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAlternatives = async (req, res) => {
  try {
    const med = await Medicine.findOne({
      brandName: { $regex: req.params.name, $options: "i" },
    });
    if (!med) return res.status(404).json({ message: "Medicine not found" });

    const alternatives = await Medicine.find({
      composition: med.composition,
      _id: { $ne: med._id },
    }).sort({ price: 1 });

    res.json({ original: med, alternatives });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
