import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import medicineRoutes from "./routes/medicineRoutes.js";
import scanRoutes from "./routes/scanRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/medicine", medicineRoutes);
app.use("/api/scan", scanRoutes);

app.get("/", (req, res) => res.send("Pharma AI backend running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
