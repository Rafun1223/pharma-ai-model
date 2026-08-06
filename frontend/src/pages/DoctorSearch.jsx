import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import StarRating from "../components/StarRating";

function DoctorSearch() {
  const [specialty, setSpecialty] = useState("");
  const [city, setCity] = useState("");
  const [doctors, setDoctors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setDoctors(null);

    try {
      const params = {};
      if (specialty.trim()) params.specialty = specialty.trim();
      if (city.trim()) params.city = city.trim();

      const res = await api.get("/doctors", { params });
      setDoctors(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Search failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Find a Doctor</h2>
      <p className="text-gray-500 mb-6">
        Search by department/specialty and your city — top-rated doctors show
        first
      </p>

      <form
        onSubmit={handleSearch}
        className="flex flex-col sm:flex-row gap-2 mb-6"
      >
        <input
          type="text"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          placeholder="Department e.g. Cardiologist"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Your city e.g. Chittagong"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      {loading && <p className="text-gray-500 text-center">Searching...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {doctors && doctors.length === 0 && (
        <p className="text-gray-500 text-center">
          No doctors found. Try a different department or city.
        </p>
      )}

      {doctors && doctors.length > 0 && (
        <div className="space-y-3">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              onClick={() => navigate(`/doctors/${doc.id}`)}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm cursor-pointer hover:border-blue-400 transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-gray-800">{doc.name}</p>
                  <p className="text-sm text-gray-500">
                    {doc.specialty} · {doc.clinicName}
                  </p>
                  <p className="text-sm text-gray-400">{doc.city}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    ৳{doc.consultationFee}
                  </p>
                  <p className="text-xs text-gray-400">
                    {doc.experienceYears} yrs exp
                  </p>
                </div>
              </div>
              <div className="mt-2">
                <StarRating
                  rating={doc.avgRating}
                  totalReviews={doc.totalReviews}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DoctorSearch;
