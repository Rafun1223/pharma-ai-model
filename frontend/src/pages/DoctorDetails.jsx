import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import StarRating from "../components/StarRating";

function DoctorDetails() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Review form state
  const [patientName, setPatientName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Appointment booking state
  const [patientPhone, setPatientPhone] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");

  const loadDoctor = () => {
    setLoading(true);
    api
      .get(`/doctors/${id}`)
      .then((res) => {
        setDoctor(res.data.doctor);
        setReviews(res.data.reviews);
      })
      .catch((err) =>
        setError(err.response?.data?.message || "Doctor not found"),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDoctor();
  }, [id]);

  // Fetch available slots whenever the selected date changes
  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      return;
    }
    setLoadingSlots(true);
    setSelectedSlot(null);
    setBookingError("");
    api
      .get(`/doctors/${id}/slots`, { params: { date: selectedDate } })
      .then((res) => setSlots(res.data.slots))
      .catch(() => setSlots([]))
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!patientName.trim() || rating === 0) {
      setSubmitError("Please enter your name and select a rating.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post(`/doctors/${id}/reviews`, {
        patientName: patientName.trim(),
        rating,
        comment: comment.trim(),
      });
      setRating(0);
      setComment("");
      loadDoctor();
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    setBookingError("");
    setBookingSuccess("");

    if (
      !patientName.trim() ||
      !patientPhone.trim() ||
      !selectedDate ||
      !selectedSlot
    ) {
      setBookingError(
        "Please fill in your name, phone, date, and pick a time slot.",
      );
      return;
    }

    setBooking(true);
    try {
      await api.post(`/doctors/${id}/appointments`, {
        patientName: patientName.trim(),
        patientPhone: patientPhone.trim(),
        appointmentDate: selectedDate,
        slotStart: selectedSlot,
      });
      setBookingSuccess(
        `Appointment requested for ${selectedDate} at ${selectedSlot}. The clinic will confirm shortly.`,
      );
      setPatientPhone("");
      setSelectedDate("");
      setSelectedSlot(null);
      setSlots([]);
    } catch (err) {
      setBookingError(
        err.response?.data?.message || "Booking failed. Try again.",
      );
    } finally {
      setBooking(false);
    }
  };

  if (loading)
    return <div className="text-center py-20 text-gray-500">Loading...</div>;

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/doctors" className="text-blue-600 hover:underline">
          ← Back to doctor search
        </Link>
      </div>
    );
  }

  // Get today's date in YYYY-MM-DD format for the date input's min attribute
  const todayStr = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link to="/doctors" className="text-blue-600 hover:underline text-sm">
        ← Back to doctor search
      </Link>

      {/* Doctor info card */}
      {doctor.assistant && (
        <div>
          <span className="text-gray-400">Assistant</span>
          <p className="font-medium text-gray-700">{doctor.assistant.name}</p>
        </div>
      )}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mt-4">
        <h2 className="text-2xl font-bold text-gray-800">{doctor.name}</h2>
        <p className="text-gray-500">
          {doctor.specialty} · {doctor.clinicName}
        </p>
        <p className="text-gray-400 text-sm">{doctor.city}</p>

        <div className="mt-3">
          <StarRating
            rating={doctor.avgRating}
            totalReviews={doctor.totalReviews}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <span className="text-gray-400">Consultation Fee</span>
            <p className="font-medium text-gray-700">
              ৳{doctor.consultationFee}
            </p>
          </div>
          <div>
            <span className="text-gray-400">Experience</span>
            <p className="font-medium text-gray-700">
              {doctor.experienceYears} years
            </p>
          </div>
          <div>
            <span className="text-gray-400">Available Days</span>
            <p className="font-medium text-gray-700">
              {doctor.availableDays.join(", ")}
            </p>
          </div>
          <div>
            <span className="text-gray-400">Working Hours</span>
            <p className="font-medium text-gray-700">
              {doctor.startTime} - {doctor.endTime}
            </p>
          </div>
        </div>
      </div>

      {/* Appointment booking */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mt-6">
        <h3 className="font-semibold text-gray-800 mb-3">
          Book an Appointment
        </h3>
        <form onSubmit={handleBookAppointment} className="space-y-3">
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Your name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="tel"
            value={patientPhone}
            onChange={(e) => setPatientPhone(e.target.value)}
            placeholder="Phone number"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            value={selectedDate}
            min={todayStr}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {loadingSlots && (
            <p className="text-gray-500 text-sm">Loading available times...</p>
          )}

          {!loadingSlots && selectedDate && slots.length === 0 && (
            <p className="text-red-500 text-sm">
              No slots available on this date (doctor may not work this day, or
              fully booked). Try another date.
            </p>
          )}

          {!loadingSlots && slots.length > 0 && (
            <div>
              <p className="text-sm text-gray-500 mb-2">Select a time slot:</p>
              <div className="flex flex-wrap gap-2">
                {slots.map((slot) => (
                  <button
                    type="button"
                    key={slot.slotStart}
                    onClick={() => setSelectedSlot(slot.slotStart)}
                    className={`px-3 py-2 rounded-lg text-sm border transition ${
                      selectedSlot === slot.slotStart
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
                    }`}
                  >
                    {slot.slotStart} - {slot.slotEnd}
                  </button>
                ))}
              </div>
            </div>
          )}

          {bookingError && (
            <p className="text-red-500 text-sm">{bookingError}</p>
          )}
          {bookingSuccess && (
            <p className="text-green-600 text-sm">{bookingSuccess}</p>
          )}

          <button
            type="submit"
            disabled={booking}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:bg-gray-300"
          >
            {booking ? "Booking..." : "Request Appointment"}
          </button>
        </form>
      </div>

      {/* Review form */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mt-6">
        <h3 className="font-semibold text-gray-800 mb-3">Leave a Review</h3>
        <form onSubmit={handleSubmitReview} className="space-y-3">
          <input
            type="text"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Your name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
              >
                ★
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience (optional)"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />

          {submitError && <p className="text-red-500 text-sm">{submitError}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>

      {/* Existing reviews */}
      <div className="mt-6">
        <h3 className="font-semibold text-gray-800 mb-3">
          Patient Reviews ({reviews.length})
        </h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-800">{r.patientName}</p>
                  <StarRating rating={r.rating} totalReviews={0} />
                </div>
                {r.comment && (
                  <p className="text-gray-600 text-sm mt-1">{r.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DoctorDetails;
