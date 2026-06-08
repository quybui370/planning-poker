# Planning Poker

A real-time planning poker app built with React, TypeScript, Vite, and Firebase Realtime Database.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A [Firebase](https://firebase.google.com/) project with **Realtime Database** enabled

---

## Firebase Realtime Database Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project (or use an existing one).
2. In the left sidebar, navigate to **Build → Realtime Database** and click **Create Database**.
3. Choose a region and start in **test mode** (you can lock down rules later).
4. Go to **Project Settings → General → Your apps** and click **Add app** button and select the web icon (`</>`) to register a web app.
5. Copy the config values — you'll need them in the next step.

### Firebase Security Rules (recommended)

In the Realtime Database **Rules** tab, replace the default rules with:

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

OR setting the rules to expire on January 1, 2030

```json
{
  "rules": {
    ".read": "now < 1893456000000",
    ".write": "now < 1893456000000"
  }
}
```

> Tighten these rules before going to production.

---

## Environment Variables

Create a `.env` file at the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## Run Locally

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:5173/planning-poker/](http://localhost:5173/planning-poker/) in your browser.

---

## Deploy to GitHub Pages

1. Install the `gh-pages` package (already included as a dev dependency):

   ```bash
   npm install --save-dev gh-pages
   ```

2. Ensure `vite.config.ts` has the correct `base` path matching your repo name:

   ```ts
   export default defineConfig({
     base: "/planning-poker/",
     // ...
   });
   ```

3. Add a `deploy` script to `package.json` (already present):

   ```json
   "scripts": {
     "build": "tsc -b && vite build",
     "deploy": "gh-pages -d dist"
   }
   ```

4. Build and deploy:

   ```bash
   npm run build
   npm run deploy
   ```

5. In your GitHub repo, go to **Settings → Pages** and set the source to the `gh-pages` branch.

6. Add your Firebase environment variables. Since GitHub Pages is a static host with no server-side env support, you have two options:
   - **Recommended:** Use a [GitHub Actions workflow](#github-actions-with-env-variables) to inject them at build time.
   - Hardcode values into a `.env.production` file (never commit secrets to a public repo).

### GitHub Actions with Env Variables

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Build
        env:
          VITE_FIREBASE_API_KEY: ${{ secrets.VITE_FIREBASE_API_KEY }}
          VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.VITE_FIREBASE_AUTH_DOMAIN }}
          VITE_FIREBASE_DATABASE_URL: ${{ secrets.VITE_FIREBASE_DATABASE_URL }}
          VITE_FIREBASE_PROJECT_ID: ${{ secrets.VITE_FIREBASE_PROJECT_ID }}
          VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.VITE_FIREBASE_STORAGE_BUCKET }}
          VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.VITE_FIREBASE_MESSAGING_SENDER_ID }}
          VITE_FIREBASE_APP_ID: ${{ secrets.VITE_FIREBASE_APP_ID }}
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

Add each `VITE_*` key under **Settings → Secrets and variables → Actions** in your GitHub repo.

---

## Deploy to Vercel

1. Install the [Vercel CLI](https://vercel.com/docs/cli) or connect your GitHub repo directly via the Vercel dashboard.

2. If using the CLI:

   ```bash
   npm i -g vercel
   vercel
   ```

3. In the Vercel dashboard, go to your project → **Settings → Environment Variables** and add all `VITE_*` keys from your `.env` file.

4. Vercel auto-detects Vite. No additional config is required beyond the environment variables.

   > If you need the `/planning-poker/` base path (e.g. for consistency with GitHub Pages), keep `base: '/planning-poker/'` in `vite.config.ts`. Otherwise, set `base: '/'` for a cleaner Vercel URL.

5. Every push to `main` triggers an automatic production deployment.
