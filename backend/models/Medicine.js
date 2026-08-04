import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    brandName: { type: String, required: true },
    composition: { type: String, required: true },
    manufacturer: String,
    price: { type: Number, required: true },
    packSize: String,
    dosageForm: String,
    usage: String,
    sideEffects: [String],
  },
  { timestamps: true },
);

medicineSchema.index({ composition: 1 });

export default mongoose.model("Medicine", medicineSchema);
