import dotenv from "dotenv";
import prisma from "./config/db.js";

dotenv.config();

const doctors = [
  {
    name: "Dr. Anika Rahman",
    specialty: "Cardiologist",
    clinicName: "Heart Care Center",
    city: "Chittagong",
    experienceYears: 12,
    consultationFee: 800,
  },
  {
    name: "Dr. Farhan Kabir",
    specialty: "Cardiologist",
    clinicName: "City Heart Clinic",
    city: "Chittagong",
    experienceYears: 8,
    consultationFee: 600,
  },
  {
    name: "Dr. Nusrat Jahan",
    specialty: "General Physician",
    clinicName: "Patiya Health Point",
    city: "Patiya",
    experienceYears: 6,
    consultationFee: 400,
  },
  {
    name: "Dr. Kamal Hossain",
    specialty: "General Physician",
    clinicName: "Chattogram General Clinic",
    city: "Chittagong",
    experienceYears: 15,
    consultationFee: 500,
  },
  {
    name: "Dr. Sadia Islam",
    specialty: "Dermatologist",
    clinicName: "Skin & Care",
    city: "Chittagong",
    experienceYears: 9,
    consultationFee: 700,
  },
];

const seedDoctors = async () => {
  try {
    await prisma.review.deleteMany({});
    await prisma.doctor.deleteMany({});
    await prisma.doctor.createMany({ data: doctors });
    console.log("Doctors seeded successfully!");
  } catch (err) {
    console.error("Seeding failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
};

seedDoctors();
