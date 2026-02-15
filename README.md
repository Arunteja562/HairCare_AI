# HairCare_AI 

This repository contains a full‑stack Web application for 
# Hair‑Fall Prediction System.
It includes:

* a React/Bootstrap **frontend** with registration/login, prediction forms, dashboard, etc.
* an Express/Node **backend** providing RESTful APIs, JWT authentication, OAuth2, email support.
* a **machine‑learning module** (Python) for training and evaluating the prediction model.

All communication between the front‑end and back‑end happens over JSON; the ML code is used for
offline data generation & model training and is not served at runtime.

---

## Technologies Used

| Layer          | Key Libraries / Tools |
|-------         |-----------------------|
| Frontend | React, React Router v6, Axios, Bootstrap 5 & Bootstrap Icons, react‑oauth‑google |
| State/Utils | localStorage, custom hooks, form handling (no Redux) |
| Styling | CSS modules under `src/styles`, responsive media queries, create‑react‑app defaults |
| Backend | Node.js, Express, Mongoose (MongoDB), bcryptjs, jsonwebtoken, passport (Google/LinkedIn), nodemailer |
| API Auth | JWT bearer tokens, custom `authMiddleware`/`protect` helpers |
| ML | Python 3.13 virtualenv, pandas, scikit‑learn, fastapi (optional), joblib, numpy, matplotlib |
| Dev tools | ESLint, Prettier, nodemon, create‑react‑app CLI, npm

> See `package.json` files in each folder for full dependency lists.


## Getting Started

### Frontend

cd frontend
npm install    # first time only
npm start      # runs dev server on http://localhost:3000


### Backend

# cd backend
npm install
npm start
# or `npm start` to run in production mode

The backend listens on port 5001 by default (see `server.js` environment variables).

### Machine‑Learning Module

Activate the Python virtual environment in `ml-model` and run the scripts as needed:

# cd ml-model
# activate your env (Windows): Scripts\\activate
python generate_training_data.py
python train_model.py
python evaluate_model.py

Those scripts load `hair_fall_dataset.csv` and output models and metrics – they are
independent of the Node.js server.
--- 

## Project Flow & Structure

The application follows a straightforward client-server architecture:

1. **Frontend (React)**: renders pages and forms, manages navigation and authentication
   state.  Users interact via registration, login, prediction form, and dashboard.
   Once logged in a JWT is stored locally and attached to every API request.

2. **Backend (Express/MongoDB)**: exposes REST endpoints under `/api/*` for user
   management, prediction storage, dashboard data and email/contact features.  It
   validates the token on protected routes using middleware (`protect`).  The
   backend persists users and predictions in MongoDB via Mongoose models.

3. **Machine‑Learning module (Python)**: generates synthetic training data and
   trains/evaluates a hair‑fall prediction model offline.  The resulting model is
   not served by the Express server; predictions are currently computed in a simple
   heuristic on the backend but the ML code can be used for future improvements.

Data flows from React → backend API → database, and from backend to React on
responses.  The ML component is a separate pipeline that writes model artifacts to
`ml-model/`.

### Workflow

1. **Visitor** opens the React web app in a browser.
2. If unauthenticated, user is redirected to registration/login pages (see
   `PrivateRoute`).
3. **Registration** form submits to `/api/auth/register`; successful response
   returns a status message, then the UI directs the user to login.
4. **Login** form posts to `/api/auth/login`; backend validates credentials,
   issues a JWT which the frontend stores in `localStorage`.
5. **Subsequent API calls** (prediction, dashboard, profile, etc.) include the
   `Authorization: Bearer <token>` header; middleware on the server reads the
   token, verifies it, and populates `req.userId`.
6. Valid requests are processed by controllers (`predictController`,
   `dashboardController`, etc.), which read/write MongoDB via Mongoose models.
7. **Results** (profile data, saved predictions, dashboard summaries) are returned as
   JSON and rendered by React components.
8. **Logout** clears the token client‑side, causing protected routes/links to
   disappear and forcing the app back to the login screen.

This describes the end‑to‑end workflow of the application from user action to
persistent storage and back.
---

Each subproject supports the usual `npm run` commands; see the respective `package.json`.
The React app supports `npm start`, `npm run build`, `npm test`, etc.

The backend has `start`, `dev` (with nodemon) and additional utility scripts.

---
## Usage Flow

1. Open the frontend in the browser.
2. Register a new user (required, because `/about` and other pages are protected).
3. Log in to receive a JWT; the token is stored in `localStorage`.
4. Use the prediction form, view past predictions, visit the dashboard.
5. Logout clears the token and hides protected links.

The React router and `PrivateRoute` component enforce authentication on protected
routes.
---

## Folder Structure
```
backend/          # Express server
frontend/         # React app
ml-model/         # Python scripts and dataset
```
## Contributors
- **Member 1**: Vasam Arunteja
Add your preferred contact details or links so visitors can reach you. Example:

# Email: vasamaruntej143@gmail.com  
# LinkedIn: https://www.linkedin.com/in/vasam-arunteja2002-00ab11256 
# GitHub: https://github.com/Arunteja562
# POrtfolio: https://arunteja-portfolio-website.netlify.app/
---

