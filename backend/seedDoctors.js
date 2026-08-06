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
    availableDays: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    startTime: "10:00",
    endTime: "14:00",
    slotDurationMin: 20,
  },
  {
    name: "Dr. Farhan Kabir",
    specialty: "Cardiologist",
    clinicName: "City Heart Clinic",
    city: "Chittagong",
    experienceYears: 8,
    consultationFee: 600,
    availableDays: ["Sat", "Sun", "Mon", "Tue"],
    startTime: "16:00",
    endTime: "19:00",
    slotDurationMin: 15,
  },
  {
    name: "Dr. Nusrat Jahan",
    specialty: "General Physician",
    clinicName: "Patiya Health Point",
    city: "Patiya",
    experienceYears: 6,
    consultationFee: 400,
    availableDays: ["Sun", "Mon", "Tue", "Wed", "Thu"],
    startTime: "09:00",
    endTime: "13:00",
    slotDurationMin: 15,
  },
  {
    name: "Dr. Kamal Hossain",
    specialty: "General Physician",
    clinicName: "Chattogram General Clinic",
    city: "Chittagong",
    experienceYears: 15,
    consultationFee: 500,
    availableDays: ["Mon", "Wed", "Fri"],
    startTime: "11:00",
    endTime: "15:00",
    slotDurationMin: 20,
  },
  {
    name: "Dr. Sadia Islam",
    specialty: "Dermatologist",
    clinicName: "Skin & Care",
    city: "Chittagong",
    experienceYears: 9,
    consultationFee: 700,
    availableDays: ["Tue", "Thu", "Sat"],
    startTime: "15:00",
    endTime: "18:00",
    slotDurationMin: 30,
  },
];

const assistantNames = [
  "Rina Akter",
  "Tanvir Ahmed",
  "Mitu Chowdhury",
  "Sabbir Hossain",
  "Priya Das",
];

const seedDoctors = async () => {
  try {
    // 1. Clear everything in the correct dependency order
    await prisma.appointment.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.assistant.deleteMany({});
    await prisma.doctor.deleteMany({});

    // 2. Create fresh doctors
    await prisma.doctor.createMany({ data: doctors });

    // 3. Fetch the newly created doctors (so we have their real IDs)
    const createdDoctors = await prisma.doctor.findMany();

    // 4. Create one assistant per doctor
    for (let i = 0; i < createdDoctors.length; i++) {
      await prisma.assistant.create({
        data: {
          doctorId: createdDoctors[i].id,
          name: assistantNames[i] || `Assistant ${i + 1}`,
          phone: "01700000000",
        },
      });
    }

    console.log("Doctors and assistants seeded successfully!");
  } catch (err) {
    console.error("Seeding failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
};

seedDoctors();
