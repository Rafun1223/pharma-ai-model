import mongoose from "mongoose";
import dotenv from "dotenv";
import Medicine from "./models/Medicine.js";

dotenv.config();

const medicines = [
  {
    brandName: "Dolo 650",
    composition: "Paracetamol 650mg",
    manufacturer: "Micro Labs",
    price: 30,
    packSize: "15 tablets",
    dosageForm: "Tablet",
    usage: "Fever, mild pain relief",
    sideEffects: ["Nausea", "Rash (rare)"],
  },
  {
    brandName: "Crocin 650",
    composition: "Paracetamol 650mg",
    manufacturer: "GSK",
    price: 35,
    packSize: "15 tablets",
    dosageForm: "Tablet",
    usage: "Fever, mild pain relief",
    sideEffects: ["Nausea", "Rash (rare)"],
  },
  {
    brandName: "Calpol 650",
    composition: "Paracetamol 650mg",
    manufacturer: "GSK",
    price: 28,
    packSize: "15 tablets",
    dosageForm: "Tablet",
    usage: "Fever, mild pain relief",
    sideEffects: ["Nausea", "Rash (rare)"],
  },
  {
    brandName: "Combiflam",
    composition: "Ibuprofen 400mg + Paracetamol 325mg",
    manufacturer: "Sanofi",
    price: 40,
    packSize: "20 tablets",
    dosageForm: "Tablet",
    usage: "Pain relief, inflammation, fever",
    sideEffects: ["Stomach upset", "Dizziness"],
  },
  {
    brandName: "Ibugesic Plus",
    composition: "Ibuprofen 400mg + Paracetamol 325mg",
    manufacturer: "Cipla",
    price: 32,
    packSize: "20 tablets",
    dosageForm: "Tablet",
    usage: "Pain relief, inflammation, fever",
    sideEffects: ["Stomach upset", "Dizziness"],
  },
  {
    brandName: "Augmentin 625",
    composition: "Amoxicillin 500mg + Clavulanic Acid 125mg",
    manufacturer: "GSK",
    price: 220,
    packSize: "10 tablets",
    dosageForm: "Tablet",
    usage: "Bacterial infections",
    sideEffects: ["Diarrhea", "Nausea", "Allergic reactions"],
  },
  {
    brandName: "Moxikind-CV 625",
    composition: "Amoxicillin 500mg + Clavulanic Acid 125mg",
    manufacturer: "Mankind Pharma",
    price: 150,
    packSize: "10 tablets",
    dosageForm: "Tablet",
    usage: "Bacterial infections",
    sideEffects: ["Diarrhea", "Nausea", "Allergic reactions"],
  },
  {
    brandName: "Pantop 40",
    composition: "Pantoprazole 40mg",
    manufacturer: "Aristo Pharma",
    price: 90,
    packSize: "15 tablets",
    dosageForm: "Tablet",
    usage: "Acidity, GERD, ulcers",
    sideEffects: ["Headache", "Diarrhea"],
  },
  {
    brandName: "Pan 40",
    composition: "Pantoprazole 40mg",
    manufacturer: "Alkem Labs",
    price: 105,
    packSize: "15 tablets",
    dosageForm: "Tablet",
    usage: "Acidity, GERD, ulcers",
    sideEffects: ["Headache", "Diarrhea"],
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Medicine.deleteMany({});
    await Medicine.insertMany(medicines);
    console.log("Seeded successfully!");
  } catch (err) {
    console.error("Seeding failed:", err.message);
  } finally {
    process.exit();
  }
};

seedDB();
