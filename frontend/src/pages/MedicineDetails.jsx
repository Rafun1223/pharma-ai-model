import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

function MedicineDetails() {
  const { name } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .get(`/medicine/${name}/alternatives`)
      .then((res) => setData(res.data))
      .catch((err) => {
        setError(
          err.response?.data?.message ||
            "Medicine not found. Try another name.",
        );
      })
      .finally(() => setLoading(false));
  }, [name]);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/" className="text-blue-600 hover:underline">
          ← Back to search
        </Link>
      </div>
    );
  }

  const { original, alternatives } = data;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <Link to="/" className="text-blue-600 hover:underline text-sm">
        ← Back to search
      </Link>

      {/* Original medicine card */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mt-4">
        <h2 className="text-2xl font-bold text-gray-800">
          {original.brandName}
        </h2>
        <p className="text-gray-500">{original.composition}</p>

        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <span className="text-gray-400">Manufacturer</span>
            <p className="font-medium text-gray-700">{original.manufacturer}</p>
          </div>
          <div>
            <span className="text-gray-400">Price</span>
            <p className="font-medium text-gray-700">৳{original.price}</p>
          </div>
          <div>
            <span className="text-gray-400">Pack Size</span>
            <p className="font-medium text-gray-700">{original.packSize}</p>
          </div>
          <div>
            <span className="text-gray-400">Form</span>
            <p className="font-medium text-gray-700">{original.dosageForm}</p>
          </div>
        </div>

        <div className="mt-4 text-sm">
          <span className="text-gray-400">Usage</span>
          <p className="text-gray-700">{original.usage}</p>
        </div>

        {original.sideEffects?.length > 0 && (
          <div className="mt-4 text-sm">
            <span className="text-gray-400">Side Effects</span>
            <p className="text-gray-700">{original.sideEffects.join(", ")}</p>
          </div>
        )}
      </div>

      {/* Alternatives comparison */}
      <h3 className="text-lg font-semibold text-gray-800 mt-8 mb-3">
        Cheaper / Alternative Options
      </h3>

      {alternatives.length === 0 ? (
        <p className="text-gray-500">No alternatives found in database.</p>
      ) : (
        <div className="space-y-3">
          {alternatives.map((alt) => (
            <div
              key={alt.id}
              className="flex justify-between items-center bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
            >
              <div>
                <p className="font-medium text-gray-800">{alt.brandName}</p>
                <p className="text-gray-400 text-sm">{alt.manufacturer}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-green-600">৳{alt.price}</p>
                {alt.price < original.price && (
                  <p className="text-xs text-green-500">Cheaper option</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MedicineDetails;
