# 🏥 University Medical Center Management System

A modern web application built to streamline the operations of the **University of Vavuniya Medical Center**.  
This system provides an all-in-one digital platform for students, staff, and medical personnel to manage medical records, appointments, and inventory efficiently.

---

## 🌐 Project Vision

The goal of this project is to **digitize healthcare services** within the university ecosystem.  
Instead of relying on paper-based records, the Medical Center Management System provides a **secure, scalable, and user-friendly** platform for healthcare workflows.



---

## ✨ Core Features

### 👩‍⚕️ For Patients
* Submit **exam or attendance medical forms** online  
* View **personal medical history** and doctor consultations  
* Book or cancel **doctor appointments** * Get notifications for upcoming visits  

### 🩺 For Doctors
* View assigned **appointments and patient details**
* Update **diagnosis notes** and prescribed drugs  
* Access the **drug inventory system** in real time  

### 🔐 For Admins
* Manage **users, appointments, and doctors**
* Maintain **drug stock levels and usage reports**
* Post **news, updates, and announcements**
* Handle **role-based authentication** (Admin / Doctor / Student)

---

## ⚙️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React.js, Tailwind CSS |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (via Mongoose) |
| **Authentication** | JWT (JSON Web Token) |
| **State Management** | React Context API |
| **Deployment Ready** | Vite + Node.js Server |

---

## 🏗️ System Architecture

Frontend (React + Tailwind) ↓ Backend API (Node + Express) ↓ MongoDB (Data Layer)


All API routes are protected with **JWT-based authentication**, ensuring secure access control between different roles (Admin, Doctor, Patient).

---

## 🧠 Highlights

* 💬 RESTful API Design  
* ⚡ Real-time responsive UI with Vite  
* 🔐 Role-Based Access Control (RBAC)  
* 📦 Efficient Drug Inventory Tracking  
* 🧾 Digital Medical Records for Students  

---

## 📸 Screenshots

| Dashboard | Appointment Page | Drug Inventory |
| :---: | :---: | :---: |
| <img src="https://github.com/user-attachments/assets/eb536438-94bd-463e-8c38-d458d8c51ed5" width="300" /> | <img src="https://github.com/user-attachments/assets/b98894ec-8977-4801-99a9-3e4c022c0d5c" width="300" /> | <img src="https://github.com/user-attachments/assets/7050b191-5605-47a7-8c03-152a0670e3c9" width="300" /> |

---

## 🧰 Installation & Setup

### 1️⃣ Prerequisites
Make sure you have the following installed:
* [Node.js](https://nodejs.org/) (v14+)
* [MongoDB](https://www.mongodb.com/try/download/community)
* npm or yarn

### 2️⃣ Clone the Repository
```bash
git clone [https://github.com/kosala-dev/Healthcare-University-Medical-Center-Management-System.git](https://github.com/kosala-dev/Healthcare-University-Medical-Center-Management-System.git)
cd Healthcare-University-Medical-Center-Management-System
3️⃣ Backend Setup
Bash

cd backend
npm install
Create a .env file inside the backend folder:


Code snippet
URL=http://localhost:5000
SUPERADMIN_KEY=superadmin-key
PATIENT_KEY=student-key
ADMIN_KEY=admin-key
MONGO_URI=mongodb://127.0.0.1:27017/medicalcenter
EMAIL_USER=medicalcenteruov@gmail.com
EMAIL_PASS=your_passkey_here
Start the backend:

Bash

npm start
4️⃣ Frontend Setup
Bash

cd ../frontend
npm install
npm run dev
Note: The frontend will start at http://localhost:5173 and the backend runs at http://localhost:5000.

🗂️ Folder Structure
│
├── backend/
│   ├── controllers/      # API logic
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API endpoints
│   ├── middleware/       # Authentication & validation
│   └── server.js         # Server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── pages/        # Route pages
│   │   ├── services/     # API service calls
│   │   ├── context/      # Global context
│   │   └── App.js        # Root component
│   └── package.json
│
└── README.md
```

🚀 Future Enhancements

📈 Advanced analytics and reporting dashboards

🌍 Multi-language support for better accessibility

📱 Mobile App Version (React Native)

🧑‍💻 Author
Kosala Madushan 📍
University of Vavuniya


🔗 GitHub Profile

🪪 License
This project is released under the Private License.

You are not allowed to modify and distribute it without explicit attribution.
