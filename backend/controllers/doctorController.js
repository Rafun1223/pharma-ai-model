import prisma from "../config/db.js";

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

    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDoctorById = async (req, res) => {
  try {
    const doctor = await prisma.doctor.findUnique({
      where: { id: req.params.id },
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
      data: {
        doctorId: doctor.id,
        patientName,
        rating,
        comment,
      },
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
