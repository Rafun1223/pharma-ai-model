import prisma from "../config/db.js";
import { generateSlotsForDate, findNextAvailableSlot } from "../utils/slots.js";

export const getDoctors = async (req, res) => {
  try {
    const { specialty, city } = req.query;

    const where = {};
    if (specialty)
      where.specialty = { contains: specialty, mode: "insensitive" };
    if (city) where.city = { contains: city, mode: "insensitive" };

    const doctors = await prisma.doctor.findMany({
      where,
      orderBy: [{ avgRating: "desc" }, { totalReviews: "desc" }],
    });

    // Attach next available slot info to each doctor, then sort:
    // available-soonest doctors first (within same rating tier), unavailable-this-week doctors last
    const withAvailability = await Promise.all(
      doctors.map(async (doc) => {
        const nextSlot = await findNextAvailableSlot(prisma, doc);
        return { ...doc, nextAvailable: nextSlot };
      }),
    );

    withAvailability.sort((a, b) => {
      // Doctors with no availability in next 7 days go last, regardless of rating
      if (!a.nextAvailable && b.nextAvailable) return 1;
      if (a.nextAvailable && !b.nextAvailable) return -1;
      if (!a.nextAvailable && !b.nextAvailable)
        return b.avgRating - a.avgRating;

      // Both available: prioritize rating first, then soonest date as tiebreaker
      if (b.avgRating !== a.avgRating) return b.avgRating - a.avgRating;
      return new Date(a.nextAvailable.date) - new Date(b.nextAvailable.date);
    });

    res.json(withAvailability);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: req.params.id },
      include: { assistant: true },
    });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const reviews = await prisma.review.findMany({
      where: { doctorId: doctor.id },
      orderBy: { createdAt: "desc" },
    });

    res.json({ doctor, reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/doctors/:id/slots?date=2026-08-10
export const getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date)
      return res
        .status(400)
        .json({ message: "date query param required (YYYY-MM-DD)" });

    const doctor = await prisma.doctor.findUnique({
      where: { id: req.params.id },
    });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(checkDate);
    nextDay.setDate(checkDate.getDate() + 1);

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        appointmentDate: { gte: checkDate, lt: nextDay },
        status: { not: "cancelled" },
      },
    });

    const bookedSlots = existingAppointments.map((a) => a.slotStart);
    const slots = generateSlotsForDate(doctor, checkDate, bookedSlots);

    res.json({ date, slots });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addReview = async (req, res) => {
  try {
    const { patientName, rating, comment } = req.body;

    if (!patientName || !rating) {
      return res
        .status(400)
        .json({ message: "Patient name and rating are required" });
    }
    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { id: req.params.id },
    });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const review = await prisma.review.create({
      data: { doctorId: doctor.id, patientName, rating, comment },
    });

    const allReviews = await prisma.review.findMany({
      where: { doctorId: doctor.id },
    });
    const avg =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    const updatedDoctor = await prisma.doctor.update({
      where: { id: doctor.id },
      data: {
        avgRating: Math.round(avg * 10) / 10,
        totalReviews: allReviews.length,
      },
    });

    res.status(201).json({ review, updatedDoctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
