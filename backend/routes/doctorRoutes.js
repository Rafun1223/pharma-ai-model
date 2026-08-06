import express from "express";
import {
  getDoctors,
  getDoctorById,
  getAvailableSlots,
  addReview,
} from "../controllers/doctorController.js";
import { bookAppointment } from "../controllers/appointmentController.js";
import { requireApiKey } from "../middleware/apiKeyAuth.js";

const router = express.Router();

router.get("/", getDoctors);
router.get("/:id", getDoctorById);
router.get("/:id/slots", getAvailableSlots);
router.post("/:id/reviews", addReview);
router.post("/:id/reviews/external", requireApiKey, addReview);
router.post("/:id/appointments", bookAppointment);

export default router;
