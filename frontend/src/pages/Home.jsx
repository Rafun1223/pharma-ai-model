import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/medicine/${query.trim()}`);
  };

  return (
    <div className="flex flex-col items-center justify-center px-4 py-20">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Find Medicine Details & Alternatives
      </h1>
      <p className="text-gray-500 mb-8">
        Search by medicine name to see details and cheaper alternatives
      </p>

      <form onSubmit={handleSearch} className="w-full max-w-md flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Dolo, Crocin, Augmentin"
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Search
        </button>
      </form>

      <p className="text-gray-400 mt-6 text-sm">
        Or scan a prescription instead → go to{" "}
        <span className="text-blue-600 font-medium">Scan Prescription</span> in
        the navbar
      </p>
    </div>
  );
}

export default Home;
