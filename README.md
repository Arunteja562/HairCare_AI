▶️ How to Run This Project in VS Code

This section explains the step-by-step process to set up and run the Hair Fall Prediction System on a local machine using Visual Studio Code.

🧰 Prerequisites

Before running the project, ensure the following tools are installed:

Visual Studio Code

Python 3.9+

Node.js (LTS version)

npm

MongoDB Atlas account

Firebase account

📂 Project Structure
hairfall_prediction_system/
│
├── backend/        # FastAPI + ML Model
├── frontend/       # React + Tailwind UI
├── README.md

⚙️ Backend Setup (Python + FastAPI + ML)
Step 1: Open Project in VS Code

Open VS Code

Click File → Open Folder

Select the project root folder

Step 2: Open Terminal in VS Code
Ctrl + `   (backtick)

Step 3: Create Virtual Environment
cd backend
python -m venv venv


Activate it:

Windows

venv\Scripts\activate


Mac/Linux

source venv/bin/activate

Step 4: Install Backend Dependencies
pip install -r requirements.txt

Step 5: Configure Environment Variables

Rename:

.env.example → .env


Edit .env:

MONGODB_URI=your_mongodb_atlas_connection_url

Step 6: Run Backend Server
uvicorn main:app --reload


✅ Backend will start at:

http://127.0.0.1:8000


📘 API Documentation:

http://127.0.0.1:8000/docs

🎨 Frontend Setup (React + Tailwind CSS)
Step 1: Open New Terminal in VS Code
cd frontend

Step 2: Install Frontend Dependencies
npm install

Step 3: Firebase Configuration

Create a Firebase project

Enable Email/Password Authentication

Create a Web App

Copy Firebase configuration keys

Step 4: Setup Frontend Environment

Rename:

.env.example → .env


Edit .env:

VITE_API_BASE=http://localhost:8000
VITE_FIREBASE_API_KEY=xxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxx
VITE_FIREBASE_PROJECT_ID=xxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxx
VITE_FIREBASE_APP_ID=xxxx

Step 5: Run Frontend Server
npm run dev


✅ Frontend will start at:

http://localhost:5173

🔁 Application Flow

User registers or logs in (Firebase Auth)

User enters lifestyle & health details

Backend sends data to ML model

ML model predicts hair fall risk

Result shown on dashboard

History saved in MongoDB

Doctor recommendation shown for high risk

❗ Common Issues & Fixes
Issue	Solution
Backend not starting	Activate virtual environment
Prediction API error	Ensure backend is running
Firebase auth error	Check .env keys
Blank frontend page	Restart npm run dev
✅ Successfully Running the Project

If both servers are running:

Backend → http://127.0.0.1:8000

Frontend → http://localhost:5173

🎉 Hair Fall Prediction System is now live!
