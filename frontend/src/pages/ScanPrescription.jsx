import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

function ScanPrescription() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  const handleScan = async () => {
    if (!image) return;
    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("prescriptionImage", image);

    try {
      const res = await api.post("/scan", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Scan failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        Scan Prescription
      </h2>
      <p className="text-gray-500 mb-6">
        Upload a clear photo of a printed prescription to extract medicine names
      </p>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
        />

        {preview && (
          <img
            src={preview}
            alt="Prescription preview"
            className="mt-4 rounded-lg border border-gray-200 max-h-80 object-contain"
          />
        )}

        <button
          onClick={handleScan}
          disabled={!image || loading}
          className="mt-4 w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {loading ? "Scanning..." : "Scan Prescription"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Detected Medicines
          </h3>

          {result.matchedMedicines.length === 0 ? (
            <p className="text-gray-500">
              No known medicines matched. Try a clearer image, or the medicine
              may not be in our database yet.
            </p>
          ) : (
            <div className="space-y-2">
              {result.matchedMedicines.map((name) => (
                <Link
                  key={name}
                  to={`/medicine/${name}`}
                  className="block bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:border-blue-400 transition"
                >
                  <p className="font-medium text-gray-800">{name}</p>
                  <p className="text-sm text-blue-600">
                    View details & compare prices →
                  </p>
                </Link>
              ))}
            </div>
          )}

          <details className="mt-6 text-sm text-gray-400">
            <summary className="cursor-pointer">
              View raw extracted text (debug)
            </summary>
            <pre className="whitespace-pre-wrap mt-2 bg-gray-50 p-3 rounded-lg">
              {result.rawText}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}

export default ScanPrescription;
