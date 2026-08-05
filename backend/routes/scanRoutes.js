import express from "express";
import multer from "multer";
import { scanPrescription } from "../controllers/scanController.js";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("prescriptionImage"), scanPrescription);

export default router;
