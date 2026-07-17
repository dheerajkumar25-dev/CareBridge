# CareBridge — Doctor–Patient Appointment Portal

A MERN-stack web app where patients can search for doctors and book appointments, doctors can manage their schedule and write prescriptions, and admins verify doctors and monitor the platform. Built as a placement/internship portfolio project.

## Testing status (please read before your interview)

This project was built in an environment with **no internet access**, so I could not run `npm install` for either the backend or frontend, and there was no MongoDB instance available to connect to. Here's exactly what that means for each part:

| Part | Status |
|---|---|
| All backend files (`models/`, `controllers/`, `middleware/`, `routes/`, `server.js`) | ✅ Syntax-checked with `node --check` (catches typos/syntax errors) |
| `utils/generateSlots.js` (12h/24h time conversion) | ✅ Actually executed and tested with assertions |
| `utils/validators.js` (email/password/phone checks) | ✅ Actually executed and tested with assertions |
| `middleware/role.js` (role-based access control) | ✅ Actually executed and tested with mock request/response objects |
| `utils/dateUtils.js` (calendar month-grid math) | ✅ Actually executed and tested with assertions, including a real date check (July 1, 2026 = Wednesday) |
| Anything touching MongoDB, JWT signing, Cloudinary, Nodemailer, PDFKit | ⚠️ Written against standard, well-documented APIs, but **not run end-to-end** |
| Every React/JSX file (including the Calendar UI, dark mode, toasts, charts) | ⚠️ Written carefully, but genuinely **not run or parsed** — there's no way to syntax-check JSX without a build tool, which needs `npm install` |

**Before this goes on your resume:** run it fully yourself (see Getting Started below), fix what comes up, and be ready to talk about what you found and fixed — that's a completely normal and honest part of finishing a project like this.

## What's new in this version

- **Professional landing page** — hero with quick search, trust stats, how-it-works, closing CTA
- **Real booking calendar** — month-view grid (green/gray/red = available/unavailable/booked) instead of picking a weekday from a button list; backed by a new `GET /appointments/booked-slots/:doctorId` endpoint
- **Richer search & filters** — search now matches doctor name *or* hospital; added experience, rating, and availability-day filters
- **Pagination** — doctor search, both appointment lists, and admin doctor/patient tables
- **Dashboard charts (Recharts)** — doctor dashboard now shows revenue and unique-patients-per-month alongside appointments; admin dashboard has a new sign-up growth line chart
- **Toast notifications** — a small dependency-free toast system (see `context/ToastContext.jsx`) instead of a 3rd-party toast library; booking now also triggers a best-effort confirmation email
- **Dark mode** — toggle in the navbar, persisted in localStorage, via Tailwind's `dark:` class strategy
- **Skeleton loaders** — replace spinners on the doctor grid and appointment lists
- **Shared profile photo upload** — moved out of `doctorController.js` into a new `userController.js` so both patients and doctors can upload a photo through the same endpoint, instead of duplicating the Cloudinary logic
- **New pages that were missing before**: `DoctorProfile.jsx` (the backend already supported editing a doctor's profile, but there was no page for it) and `ManagePatients.jsx` (admin block/delete patients)



## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router, Axios, React Hook Form, Recharts
**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Multer, Cloudinary, Nodemailer, PDFKit
**Deployment target:** Vercel (frontend), Render (backend), MongoDB Atlas (database)

## Architecture

```
Browser (React SPA)
   │  Axios (JWT in Authorization header)
   ▼
Express REST API  ──▶  Middleware: helmet, cors, JWT auth, role check
   │
   ├── Mongoose ODM ──▶ MongoDB (Users, Doctors, Patients, Appointments,
   │                              Reviews, Prescriptions, MedicalReports)
   ├── Cloudinary  ──▶ profile photos & medical report files
   ├── Nodemailer  ──▶ password reset emails
   └── PDFKit      ──▶ prescription PDF generated on the fly
```

Role-based access is enforced in two places: `ProtectedRoute` on the frontend (hides pages/redirects), and `middleware/auth.js` + `middleware/role.js` on the backend (actually blocks the API request). **The backend check is the one that actually matters for security** — the frontend one is just for user experience, since a frontend check alone can always be bypassed by calling the API directly. This is a good point to make in an interview if asked about security.

## Folder Structure

```
CareBridge/
├── client/                       # React frontend (Vite)
│   ├── src/
│   │   ├── components/           # Navbar, Footer, DoctorCard, AppointmentCard, ProtectedRoute, LoadingSpinner
│   │   ├── context/AuthContext.jsx
│   │   ├── services/api.js       # shared Axios instance with JWT interceptor
│   │   ├── pages/                # Home, Login, Register, Doctors, DoctorDetails
│   │   │   ├── patient/          # PatientDashboard, PatientProfile
│   │   │   ├── doctor/           # DoctorDashboard, DoctorAvailability, DoctorAppointments, DoctorPrescription
│   │   │   └── admin/            # AdminDashboard, ManageDoctors
│   │   ├── App.jsx               # all routes
│   │   └── main.jsx
│   └── Dockerfile
├── server/                       # Express backend
│   ├── config/                   # db.js, cloudinary.js
│   ├── models/                   # User, Doctor, Patient, Appointment, Review, Prescription, MedicalReport
│   ├── middleware/                # auth (JWT), role (RBAC), errorHandler, upload (Multer)
│   ├── controllers/               # business logic, one file per resource
│   ├── routes/                    # Express routers, one file per resource
│   ├── utils/                     # generateToken, generateSlots, validators, sendEmail, generatePrescriptionPDF
│   ├── server.js
│   └── Dockerfile
├── docker-compose.yml
├── package.json                   # root: `npm run dev` starts client + server together
└── README.md
```

## Database Collections (summary)

- **User** — shared login for all 3 roles (name, email, password hash, role, isActive)
- **Doctor** — linked to a User; specialization, fee, availability (array of {day, times[]}), verified flag
- **Patient** — linked to a User; gender, dob, phone, address
- **Appointment** — doctorId, patientId, date, time, status, paymentStatus
- **Review** — one per completed appointment; rating + text
- **Prescription** — one per appointment; array of medicines + advice
- **MedicalReport** — patient-uploaded file URL (Cloudinary)

## API Endpoints

**Auth** (`/api/auth`)
- `POST /register`, `POST /login`, `POST /forgot-password`, `POST /reset-password/:token`

**Users** (`/api/users`)
- `PUT /profile/photo` — upload profile photo (any logged-in role)

**Doctors** (`/api/doctors`)
- `GET /` — search/filter/paginate (public) · `GET /:id` — profile (public)
- `GET /me` — own profile (doctor) · `PUT /profile` — update profile (doctor)
- `POST /slots`, `DELETE /slots/:day/:time` (doctor)

**Appointments** (`/api/appointments`)
- `POST /` — book (patient, sends confirmation email) · `GET /` — list, role-aware, paginated · `PUT /:id` — update status
- `GET /booked-slots/:doctorId?month=YYYY-MM` — public, used by the booking calendar

**Reviews** (`/api/reviews`)
- `POST /` (patient) · `GET /:doctorId` (public)

**Prescriptions** (`/api/prescriptions`)
- `POST /` (doctor) · `GET /:appointmentId` · `GET /:appointmentId/pdf`

**Medical Reports** (`/api/reports`)
- `POST /` (patient upload) · `GET /` (own reports) · `GET /patient/:patientId` (doctor view)

**Admin** (`/api/admin`)
- `GET /dashboard`, `GET /growth`, `GET /doctors` (paginated), `GET /patients` (paginated), `PUT /verify-doctor/:id`, `PUT /user/:id/block`, `DELETE /user/:id`, `GET /specializations` (public)

## Getting Started (Windows + PowerShell)

### 1. Install prerequisites
- **Node.js** (v18+): download from `nodejs.org`, confirm with `node --version`
- **MongoDB**: easiest is a free **MongoDB Atlas** cluster (no local install) — sign up at `mongodb.com/cloud/atlas`, create a free cluster, and copy the connection string
- **Cloudinary** free account at `cloudinary.com` (for photo/report uploads)
- Optional: a Gmail account with an **App Password** for Nodemailer (or use Ethereal for local testing)

### 2. Backend setup

```powershell
cd CareBridge/server
npm install
copy .env.example .env
```

Open `.env` and fill in `MONGO_URI` (from Atlas), `JWT_SECRET` (any long random string), and the Cloudinary/email values.

```powershell
npm run dev
```

You should see `MongoDB connected` and `CareBridge server running on port 5000`. Visit `http://localhost:5000/api/health` in a browser — you should see `{"status":"CareBridge API is running"}`.

### 3. Frontend setup

Open a **second** PowerShell window:

```powershell
cd CareBridge/client
npm install
copy .env.example .env
npm run dev
```

Open `http://localhost:5173`.

### 4. Or run both together

From the project root:

```powershell
npm install
npm run dev
```

## Debugging tips (things that commonly go wrong first)

- **"MongoDB connection failed"** → double-check `MONGO_URI` in `server/.env`, and that your Atlas cluster allows connections from your IP (Atlas → Network Access → Add IP Address).
- **CORS errors in the browser console** → confirm `CLIENT_URL` in `server/.env` matches the URL your frontend actually runs on (`http://localhost:5173` by default).
- **"Not authorized" on every request** → the JWT isn't being attached; check that `localStorage.getItem("token")` actually has a value after logging in.
- **Cloudinary upload fails** → verify all three `CLOUDINARY_*` values in `.env` are correct and there are no extra spaces.

## Known simplifications (good to mention proactively in an interview)

- Doctor availability is stored per **weekday** (e.g. "every Monday"), not per specific calendar date. The booking calendar works around this by checking, for each real date, whether that date's weekday has slots and whether they're already booked — but the doctor still can't mark "unavailable on July 21st specifically" without editing that weekday's slots entirely.
- After uploading a profile photo, `user.profileImage` in `AuthContext` isn't refreshed until the next login (the context is only populated at login/register time). A complete version would add a `refreshUser()` function.
- Pagination on `PatientDashboard`/`DoctorAppointments` applies to the raw list from the API; the Upcoming/Completed/Cancelled tabs then filter within that page, so the count next to each tab is "count on this page," not a true total. A fuller version would pass the tab as a status filter to the backend.
- The doctor search endpoint fetches all matching doctors and paginates in JavaScript (`server/controllers/doctorController.js`) rather than using MongoDB's `.skip()/.limit()`, because the name/hospital text search happens after `.populate()`. Fine at this scale; a production version would restructure the query (e.g. a text index) to paginate at the database level.
- No payment gateway integration — `paymentStatus` exists on the Appointment model but nothing sets it to `"paid"` yet.
- No automated tests beyond the small assertion-based checks in `generateSlots.js`, `validators.js`, `dateUtils.js`, and the middleware test.

## Deliberately not built (from the original spec's own "Optional Advanced Features" list)

Socket.IO real-time updates, video consultation, Stripe/Razorpay payment integration, multi-language support, PWA support, and CI/CD were all explicitly optional in the spec, so they're left for future work rather than half-implemented here.

## Future Improvements

- Switch availability to per-date slots instead of per-weekday.
- Add the payment flow (Stripe/Razorpay test mode).
- Add the admin analytics charts (popular doctors/departments, monthly trends).
- Add automated backend tests (Jest + Supertest) covering the controllers.
- Add pagination to the doctor search and appointment lists.
- Deploy: frontend to Vercel, backend to Render, database on MongoDB Atlas.
