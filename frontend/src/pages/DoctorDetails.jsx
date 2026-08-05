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

  const [patientName, setPatientName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

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
      setPatientName("");
      setRating(0);
      setComment("");
      loadDoctor(); // refresh doctor + reviews to show updated rating
    } catch (err) {
      setSubmitError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setSubmitting(false);
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

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <Link to="/doctors" className="text-blue-600 hover:underline text-sm">
        ← Back to doctor search
      </Link>

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
        </div>
      </div>

      {/* Review submission form */}
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
                className={`text-2xl ${
                  star <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
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
                key={r._id}
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
