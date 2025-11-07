# LinkedIn Clone (Full-Stack)

A minimal LinkedIn-style social feed built with React + Vite (client) and Node.js/Express + MongoDB (server). The UI is preserved from the original design while adding core social features and mobile polish.

## Features

- Auth: sign up, log in, JWT-protected routes
- Feed: newest-first posts
- Create post: text + optional base64 image upload
- Post interactions:
  - Like/unlike
  - Comments: add and delete (owner-only)
  - Edit and delete post (owner-only)
- Profile: view and edit name + bio
- Responsive: compact mobile profile card and visible logout
- Accessibility: aria-labels for interactive controls
- Feedback: global toast notifications (success/error)

## Tech Stack

- Frontend: React 19, React Router 7, Vite 7, Tailwind CSS 4
- Backend: Node.js, Express, Mongoose (MongoDB), JWT, bcryptjs
- Tooling: ESLint 9, Nodemon

## Project Structure

```
client/
  public/
  src/
    components/           # CreatePost, Post, Sidebar, MobileProfileCard, ProtectedRoute
    config/               # axios API client
    context/              # AuthContext, ToastContext
    pages/                # AuthPage, FeedPage, ProfilePage
    services/             # authService, postService, profileService
    utils/                # mapPost
server/
  index.js                # app bootstrap, Mongo connection
  middleware/             # authMiddleware (JWT verification)
  models/                 # User, Post
  routes/                 # auth (signup/login/profile), posts (CRUD, like, comments)
```

## Requirements

- Node.js 18+ recommended
- MongoDB connection string (Atlas or local)

## Setup

### 1) Server (API)

Create `server/.env` with:

```
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-strong-secret
PORT=5000
```

Install and run:

```powershell
# From repo root
cd .\server\ ; npm i ; npm run dev
```

The API will start on http://localhost:5000 (unless PORT is set).

### 2) Client (Web)

Optionally configure client env (defaults shown):

```
# client/.env
VITE_API_BASE_URL=http://localhost:5000
VITE_API_PREFIX=/api
```

Install and run:

```powershell
# New terminal, from repo root
cd .\client\ ; npm i ; npm run dev
```

Vite will print a local URL (typically http://localhost:5173). The client talks to the API at `${VITE_API_BASE_URL}${VITE_API_PREFIX}`.

## Scripts

- Client
  - `npm run dev` – start Vite dev server
  - `npm run build` – production build
  - `npm run preview` – preview the build
  - `npm run lint` – lint the client
- Server
  - `npm run dev` – start Express with nodemon
  - `npm start` – start Express with node

## API Overview

Base URL: `http://localhost:5000/api`

Auth
- POST `/auth/signup` – body: `{ name, email, password }` → `{ token, name, _id }`
- POST `/auth/login` – body: `{ email, password }` → `{ token, name, _id }`
- GET `/auth/profile` – header: `Authorization: Bearer <token>` → user (no password)
- PUT `/auth/profile` – body: `{ name, bio }`, header: Bearer → `{ msg, user }`

Posts
- GET `/posts` – list all posts (newest first)
- POST `/posts` – body: `{ text, image? }`, header: Bearer → created post
- POST `/posts/:id/like` – toggle like, header: Bearer → updated post
- POST `/posts/:id/comment` – body: `{ text }`, header: Bearer → updated post
- DELETE `/posts/:postId/comment/:commentId` – header: Bearer → updated post
- PUT `/posts/:id` – body: `{ text?, image? }`, header: Bearer → `{ msg, post }`
- DELETE `/posts/:id` – header: Bearer → `{ msg }`

Notes
- Server JSON body limit set to `5mb` to allow base64 images.
- Post edit requires you to keep at least text or image.
- Comment delete is restricted to the comment owner; post edit/delete restricted to the post owner.

## Client Details

- Auth state and token are provided via `AuthContext`.
- Toasts via `ToastContext` (`useToast().push(message, type)`), used across create/edit/delete/like/comment and profile updates.
- Route protection via `ProtectedRoute`.
- API client configured in `src/config/apiClient.js` using `VITE_API_BASE_URL` and `VITE_API_PREFIX`.

## Accessibility & UX

- Important buttons include `aria-label` attributes.
- Mobile profile card and logout are visible in small viewports.
- Share button removed per spec to simplify interactions.

## Deployment Tips

- Set `VITE_API_BASE_URL` to your deployed API origin (e.g., Render/Railway/Heroku/Vercel Functions).
- Ensure server env `JWT_SECRET` and `MONGO_URI` are set in your hosting provider.
- If serving client and server from different origins, keep CORS enabled on the API (it is by default).

### Deploying the frontend to Vercel

This repo is a monorepo; the frontend lives in `client/`.

1. Push the repo to GitHub (already done).
2. In Vercel, import your GitHub repo and set the project root to `client/`.
3. Framework Preset: Vite. Build Command: `npm run build`. Output: `dist/`.
4. Add Environment Variables in Vercel Project Settings:
  - `VITE_API_BASE_URL` = https://your-api-domain.tld (your Express server origin)
  - `VITE_API_PREFIX` = /api (optional; defaults to `/api`)
5. Save and Deploy.

Notes
- A `client/vercel.json` is included with a SPA rewrite so deep links (e.g., `/feed`, `/profile`) work.
- API calls go to `VITE_API_BASE_URL` so they are not affected by the SPA rewrite.

## Troubleshooting

- 401/403 errors: verify the `Authorization: Bearer <token>` header is sent from the client services.
- `413 Payload Too Large`: lower image size or increase `express.json({ limit: '5mb' })` on the server.
- CORS errors: confirm API origin matches `VITE_API_BASE_URL` and that `cors()` is enabled.
- Mongo connection failures: confirm `MONGO_URI` correctness and server network access rules.

## License

ISC (c) Harshit Patle
