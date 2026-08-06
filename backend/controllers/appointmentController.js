import prisma from "../config/db.js";
import { generateSlotsForDate } from "../utils/slots.js";

export const bookAppointment = async (req, res) => {
  try {
    const { patientName, patientPhone, appointmentDate, slotStart } = req.body;

    if (!patientName || !patientPhone || !appointmentDate || !slotStart) {
      return res.status(400).json({
        message:
          "patientName, patientPhone, appointmentDate, and slotStart are required",
      });
    }

    // UPDATED: include assistant when fetching doctor
    const doctor = await prisma.doctor.findUnique({
      where: { id: req.params.id },
      include: { assistant: true },
    });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const checkDate = new Date(appointmentDate);
    checkDate.setHours(0, 0, 0, 0);

    const validSlots = generateSlotsForDate(doctor, checkDate, []);
    const matchedSlot = validSlots.find((s) => s.slotStart === slotStart);

    if (!matchedSlot) {
      return res.status(400).json({
        status: "unavailable",
        message:
          "Doctor is not available at this time. Please pick a valid slot.",
      });
    }

    try {
      const appointment = await prisma.appointment.create({
        data: {
          doctorId: doctor.id,
          patientName,
          patientPhone,
          appointmentDate: checkDate,
          slotStart: matchedSlot.slotStart,
          slotEnd: matchedSlot.slotEnd,
          status: "confirmed",
        },
      });

      // UPDATED: success message now uses assistant's name
      return res.status(201).json({
        status: "confirmed",
        message: `${doctor.assistant?.name || "The assistant"} confirmed your appointment with ${doctor.name} on ${appointmentDate} at ${matchedSlot.slotStart}.`,
        appointment,
        doctor: {
          name: doctor.name,
          clinicName: doctor.clinicName,
          city: doctor.city,
        },
      });
    } catch (err) {
      if (err.code === "P2002") {
        return res.status(409).json({
          status: "unavailable",
          message:
            "This slot was just booked by another patient. Please choose a different time.",
        });
      }
      throw err;
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
