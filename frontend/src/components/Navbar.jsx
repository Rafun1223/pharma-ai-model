import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-xl font-bold">
        PharmaAI
      </Link>
      <div className="flex gap-6">
        <Link to="/" className="hover:underline">
          Search
        </Link>
        <Link to="/doctors" className="hover:underline">
          Find Doctors
        </Link>
        <Link to="/scan" className="hover:underline">
          Scan Prescription
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
