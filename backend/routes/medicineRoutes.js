import express from "express";
import {
  getMedicineByName,
  getAlternatives,
} from "../controllers/medicineController.js";

const router = express.Router();

router.get("/:name", getMedicineByName);
router.get("/:name/alternatives", getAlternatives);

export default router;
