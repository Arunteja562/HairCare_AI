Hair Fall Prediction System (Frontend + Backend + ML)
🔹 STEP 0: Prerequisites (install once)

Make sure these are installed on your laptop:

1️⃣ Install VS Code

👉 https://code.visualstudio.com/

2️⃣ Install Python (3.9 or above)

👉 https://www.python.org/downloads/

✔️ During install → check “Add Python to PATH”

Check:

python --version

3️⃣ Install Node.js (LTS)

👉 https://nodejs.org/

Check:

node -v
npm -v

4️⃣ Install MongoDB (OPTION 1 – easiest)

Use MongoDB Atlas (cloud)
👉 https://www.mongodb.com/atlas

Create free cluster → copy connection URL

(If you want local MongoDB, tell me)

🔹 STEP 1: Open Project in VS Code

Download the ZIP (already shared)

Extract it

Open VS Code

Click File → Open Folder

Select hairfall_prediction_system

You’ll see:

hairfall_prediction_system/
 ├── backend/
 ├── frontend/
 ├── README.md

🔹 STEP 2: Backend Setup (FastAPI + ML)
📌 Open Terminal in VS Code

Ctrl + ~ (tilde key)

2️⃣ Create Virtual Environment
cd backend
python -m venv venv
Activate it:
Windows
venv\Scripts\activate
Mac/Linux
source venv/bin/activate

You should see:

(venv)

3️⃣ Install Backend Requirements
pip install -r requirements.txt

4️⃣ Setup Environment Variables

Inside backend folder:

Rename:

.env.example → .env

Open .env and paste:

MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/hairfall_db

(Replace with your MongoDB Atlas URL)

5️⃣ Run Backend Server
uvicorn main:app --reload

✅ If successful, you’ll see:

Uvicorn running on http://127.0.0.1:8000

👉 Open browser:

http://127.0.0.1:8000/docs

✔️ You should see Swagger API page

✅ Backend + ML model is running

🔹 STEP 3: Frontend Setup (React + Tailwind)
📌 Open NEW Terminal (don’t close backend)
cd frontend
npm install

(wait till node_modules installs)

2️⃣ Firebase Setup (VERY IMPORTANT)

Go to 👉 https://console.firebase.google.com/

Create New Project

Enable:

Authentication → Email/Password

Create Web App

Copy Firebase config

3️⃣ Configure Frontend Environment

Rename:

.env.example → .env

4️⃣ Run Frontend
npm run dev

You’ll see:

Local: http://localhost:5173

👉 Open in browser:

http://localhost:5173

🎉 Your project is LIVE

🔹 STEP 4: How the Project Works (for Viva)
🔐 Authentication

Firebase → Login / Register / Forgot Password

📝 Registration Inputs

Name
Age
Gender
Mobile
Occupation
Stress level
Sleep hours
Family history
Diet
Hair fall level

🤖 ML Prediction

Algorithm: Random Forest

Output:

Low Risk
Medium Risk
High Risk

Accuracy improves with more data

📊 Dashboard

Prediction result
Risk visualization
Doctor recommendation (if high risk)

History tracking

🔹 STEP 5: Doctor Appointment Logic

If prediction = High Risk:
✔️ Doctor card shown
✔️ Doctor details from database/API
✔️ Appointment option enabled

Contributors

Member 1: Vasam Arunteja
Member 2: Pushpa Latha
Member 3: Nithisha
