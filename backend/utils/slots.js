// Converts "10:00" -> 600 (minutes since midnight)
function timeToMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// Converts 600 -> "10:00"
function minutesToTime(mins) {
  const h = Math.floor(mins / 60)
    .toString()
    .padStart(2, "0");
  const m = (mins % 60).toString().padStart(2, "0");
  return `${h}:${m}`;
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Generates all possible slots for a doctor on a given date, excluding already-booked ones
export function generateSlotsForDate(doctor, dateObj, bookedSlots) {
  const dayName = DAY_NAMES[dateObj.getDay()];

  if (!doctor.availableDays.includes(dayName)) {
    return []; // doctor doesn't work this day
  }

  const startMin = timeToMinutes(doctor.startTime);
  const endMin = timeToMinutes(doctor.endTime);
  const duration = doctor.slotDurationMin;

  const bookedSet = new Set(bookedSlots); // e.g. Set(["10:00", "10:20"])

  const slots = [];
  for (let t = startMin; t + duration <= endMin; t += duration) {
    const slotStart = minutesToTime(t);
    if (!bookedSet.has(slotStart)) {
      slots.push({
        slotStart,
        slotEnd: minutesToTime(t + duration),
      });
    }
  }

  return slots;
}

// Finds the doctor's NEXT available slot starting from today, looking up to 7 days ahead
export async function findNextAvailableSlot(prisma, doctor) {
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() + i);
    checkDate.setHours(0, 0, 0, 0);

    const dayName = DAY_NAMES[checkDate.getDay()];
    if (!doctor.availableDays.includes(dayName)) continue;

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

    if (slots.length > 0) {
      return { date: checkDate, ...slots[0] };
    }
  }

  return null; // no availability in the next 7 days
}
