# 🏥 CareBridge

A **full-stack MERN Doctor–Patient Appointment Portal** that enables patients to search for doctors, book appointments, upload medical reports, and allows doctors and administrators to efficiently manage healthcare workflows.

---

## ✨ Features

### 👤 Patient
- Secure JWT Authentication
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
- React 18
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
- bcryptjs
- Multer
- Cloudinary
- Nodemailer
- PDFKit

---

## 📂 Project Structure

```text
CareBridge
├── client
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   │   ├── admin
│   │   │   ├── doctor
│   │   │   └── patient
│   │   ├── services
│   │   ├── utils
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── uploads
│   ├── utils
│   ├── server.js
│   └── package.json
│
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/dheerajkumar25-dev/CareBridge.git
cd CareBridge
```

---

### 2️⃣ Backend Setup

```bash
cd server
npm install
copy .env.example .env
```

Update `.env`

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLOUDINARY_NAME=

CLOUDINARY_KEY=

CLOUDINARY_SECRET=

EMAIL_USER=

EMAIL_PASS=

CLIENT_URL=http://localhost:5173
```

Run backend

```bash
npm run dev
```

---

### 3️⃣ Frontend Setup

```bash
cd client
npm install
copy .env.example .env
npm run dev
```

---

### 4️⃣ Open Application

Frontend

```
http://localhost:5173
```

Backend

```
http://localhost:5000
```

---

## 🔐 Authentication

The application uses **JWT Authentication** with **Role-Based Access Control (RBAC).**

Supported roles

- Patient
- Doctor
- Admin

Protected APIs are secured using JWT middleware.

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

## 🏗️ System Architecture

```text
                 React + Vite
                      │
              Axios + JWT Token
                      │
               Express REST API
                      │
                Authentication
                      │
              Business Controllers
                      │
                 MongoDB Atlas
                      │
      Cloudinary | Nodemailer | PDFKit
```

---

## 🚀 Future Improvements

- Online Payment Integration
- Video Consultation
- Push Notifications
- AI-based Doctor Recommendation
- Multi-language Support
- PWA Support
- Automated Testing
- CI/CD Pipeline
- Docker Deployment

---

## 📌 Future Screenshots

Project screenshots and live demo will be added in future updates.

---

## 👨‍💻 Author

**Dheeraj Kumar**

B.Tech (Electronics & Communication Engineering)

IIIT Bhagalpur

GitHub:
https://github.com/dheerajkumar25-dev

---

## ⭐ Support

If you found this project helpful, please consider giving it a ⭐ on GitHub.