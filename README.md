# 🏥 CareBridge

A full-stack MERN Doctor–Patient Appointment Portal that enables patients to search for doctors, book appointments, manage prescriptions, and allows doctors and administrators to efficiently manage healthcare workflows.

---

## ✨ Features

### 👤 Patient
- Secure Authentication (JWT)
- Search & Filter Doctors
- Book Appointments
- Appointment History
- Upload Medical Reports
- Manage Profile

### 👨‍⚕️ Doctor
- Manage Availability
- View Patient Appointments
- Generate Digital Prescriptions
- Dashboard Analytics
- Update Professional Profile

### 🛡️ Admin
- Verify Doctors
- Manage Patients
- Dashboard Statistics
- Platform Monitoring

---

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- Recharts

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Multer
- Cloudinary
- Nodemailer
- PDFKit

---

## 📂 Project Structure

```text
CareBridge/
│
├── client/
├── server/
├── docker-compose.yml
├── package.json
└── README.md
```

---

## ⚙️ Installation

### Clone the Repository

```bash
git clone https://github.com/dheerajkumar25-dev/CareBridge.git
cd CareBridge
```

### Backend

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

### Frontend

```bash
cd client
npm install
copy .env.example .env
npm run dev
```

---

## 🔑 Environment Variables

```env
PORT=
MONGO_URI=
JWT_SECRET=

CLOUDINARY_NAME=
CLOUDINARY_KEY=
CLOUDINARY_SECRET=

EMAIL_USER=
EMAIL_PASS=
```

---

## 📡 API Modules

- Authentication
- Users
- Doctors
- Appointments
- Reviews
- Prescriptions
- Medical Reports
- Admin

---

## 🏗️ Architecture

```text
React Frontend
      │
Axios + JWT
      │
Express REST API
      │
MongoDB
```

---

## 🚀 Future Improvements

- Online Payment Integration
- Video Consultation
- Email & Push Notifications
- AI-based Doctor Recommendation
- Multi-language Support
- CI/CD Pipeline

---

## 👨‍💻 Author

**Dheeraj Kumar**

B.Tech in Electronics & Communication Engineering  
IIIT Bhagalpur

GitHub: https://github.com/dheerajkumar25-dev

---

⭐ If you found this project useful, consider giving it a star.