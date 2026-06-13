# Vardhman Electronics

Full-stack electronics shop for Vardhman Electronics with:

- Frontend: React + Vite, ready for Vercel
- Backend: Node.js HTTP API, ready for Render
- Database: Neon PostgreSQL

## Seeded Accounts

- Admin: `admin` / `vardhman@admin`
- Users: `rahul` / `rahul123`, `priya` / `priya123`

## Project Structure

```text
backend/
  package.json
  server.js
frontend/
  index.html
  package.json
  src/
    App.jsx
    main.jsx
    styles.css
```

## Local Development With Neon

Create a Neon project first and copy the pooled or direct PostgreSQL connection string.

### Backend

```powershell
cd "C:\Vardhman Electronics\backend"
npm.cmd install
$env:DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
$env:CLIENT_ORIGIN="http://localhost:5173"
npm.cmd start
```

Backend runs on:

```text
http://localhost:8000
```

### Frontend

```powershell
cd "C:\Vardhman Electronics\frontend"
npm.cmd install
$env:VITE_API_URL="http://localhost:8000"
npm.cmd run dev
```

Frontend usually runs on:

```text
http://localhost:5173
```

## Deploy Database On Neon

1. Create a Neon project.
2. Open the project dashboard.
3. Copy the connection string from the Connect section.
4. Use the connection string as `DATABASE_URL` on Render.

The backend creates tables and seeds products/users automatically on first startup.

## Deploy Backend On Render

Create a Render Web Service connected to this Git repo.

Recommended settings:

```text
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
```

Environment variables:

```text
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require
CLIENT_ORIGIN=https://your-vercel-app.vercel.app
```

After deployment, test:

```text
https://your-render-service.onrender.com/api/health
```

It should return:

```json
{"ok":true}
```

## Deploy Frontend On Vercel

Create a Vercel project connected to the same Git repo.

Recommended settings:

```text
Root Directory: frontend
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

Environment variable:

```text
VITE_API_URL=https://your-render-service.onrender.com
```

Redeploy after changing environment variables.

## Deployment Order

1. Create Neon database.
2. Deploy Render backend with `DATABASE_URL`.
3. Test Render `/api/health`.
4. Deploy Vercel frontend with `VITE_API_URL`.
5. Copy the Vercel production URL.
6. Update Render `CLIENT_ORIGIN` to that Vercel URL.
7. Redeploy Render.

## Production Notes

- Change the seeded admin password before real use.
- Replace plain-text demo passwords with password hashing.
- Replace `X-User-Id` demo auth with real sessions/JWT.
- Keep Neon credentials secret.
- Use Render/Vercel environment variables only; do not commit `.env`.
- If your frontend cannot reach the backend, check `CLIENT_ORIGIN`, `VITE_API_URL`, and browser console CORS errors first.
