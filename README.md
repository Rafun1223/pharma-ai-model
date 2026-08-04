# PharmaAI 💊

An AI-powered pharmaceutical assistant that lets users:

- Search medicines by name and view details (composition, usage, side effects)
- Compare prices with alternative/generic medicines with the same composition
- Scan a doctor's prescription image and automatically extract medicine names using Claude's vision AI

## Tech Stack

**Frontend:** React (Vite) + Tailwind CSS + React Router + Axios
**Backend:** Node.js + Express + MongoDB (Mongoose)
**AI:** Anthropic Claude API (vision) for prescription scanning

## Project Structure

pharma-ai-project/
├── backend/
│ ├── config/ # DB connection
│ ├── models/ # Mongoose schemas
│ ├── controllers/ # Route logic
│ ├── routes/ # API routes
│ ├── server.js
│ └── seed.js # Sample medicine data seeder
└── frontend/
└── src/
├── pages/ # Home, MedicineDetails, ScanPrescription
├── components/ # Navbar, etc.
└── api/ # Axios instance

## Setup Instructions

### Backend

```bash
cd backend
npm install
```

Create a `.env` file (see `.env.example` for the format) with:
PORT=5000
MONGO_URI=your_mongodb_connection_string
ANTHROPIC_API_KEY=your_anthropic_api_key
Seed sample medicine data:

```bash
node seed.js
```

Run the server:

```bash
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

## API Endpoints

| Method | Endpoint                           | Description                                                 |
| ------ | ---------------------------------- | ----------------------------------------------------------- |
| GET    | `/api/medicine/:name`              | Get medicine details by name                                |
| GET    | `/api/medicine/:name/alternatives` | Get medicine + cheaper alternatives                         |
| POST   | `/api/scan`                        | Upload prescription image, returns extracted medicine names |

## Notes

This is a learning/portfolio project. Medicine data is a small seeded sample set, not a live pharmacy database. Prescription scanning uses Claude's vision model to read medicine names from images — accuracy depends on image clarity and handwriting legibility.
