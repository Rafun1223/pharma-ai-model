import express from "express";
import {
  getDoctors,
  getDoctorById,
  addReview,
} from "../controllers/doctorController.js";

const router = express.Router();

router.get("/", getDoctors);
router.get("/:id", getDoctorById);
router.post("/:id/reviews", addReview);

export default router;
