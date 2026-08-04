import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MedicineDetails from "./pages/MedicineDetails";
import ScanPrescription from "./pages/ScanPrescription";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/medicine/:name" element={<MedicineDetails />} />
          <Route path="/scan" element={<ScanPrescription />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
