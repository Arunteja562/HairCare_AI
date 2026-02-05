This file explains how to configure Google and LinkedIn OAuth for the backend.

1) Install new dependencies

From `d:\HairCare_AI\backend` run:

```powershell
npm install passport passport-google-oauth20 passport-linkedin-oauth2 express-session
```

2) Environment variables (add to `.env`):

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret
BACKEND_URL=http://localhost:5001
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=some_long_secret
JWT_SECRET=your_jwt_secret
```

3) Set OAuth redirect URIs in provider consoles:

- Google: set redirect URI to `http://localhost:5001/api/auth/google/callback`
- LinkedIn: set redirect URI to `http://localhost:5001/api/auth/linkedin/callback`

4) Flow

- Frontend button redirects to `/api/auth/google` or `/api/auth/linkedin`.
- Provider authenticates and calls the callback.
- Backend creates/finds user, signs a JWT, and redirects the user to `${FRONTEND_URL}/login?token=<JWT>`.
- Frontend captures `?token=` and stores it in `localStorage` (implemented in `frontend/src/pages/Login.js`).

5) Notes

- This implementation creates basic users with placeholder fields for missing values (age/mobile). You should adapt to collect additional fields or prompt the user after OAuth if needed.
- In production, use HTTPS and secure cookies for sessions, and implement CSRF protections as appropriate.
