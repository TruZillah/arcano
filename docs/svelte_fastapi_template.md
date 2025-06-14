# SvelteKit + Firebase Project Template

## Project Structure
- **frontend/** - SvelteKit application
  - `src/`
    - `lib/`
      - `components/` - UI components
      - `stores/` - Svelte stores
      - `firebase.ts` - Firebase configuration
    - `routes/` - SvelteKit routes
    - `app.css` - Global styles
  - `static/` - Static assets
  - `firebase.json` - Firebase configuration
  - `package.json` - Frontend dependencies

- **backend/** - FastAPI server (for future use)
  - `main.py` - Entry point, routes
  - `llm.py` - LLM integration
  - `auth.py` - Firebase Auth verification
  - `requirements.txt` - Python dependencies

- **docs/** - Documentation
  - `project_implementation_plan.md`
  - `cursor_instructions.md`

---

### File: `frontend/src/lib/firebase.ts`
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY,
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

---

### File: `frontend/src/lib/stores/auth.ts`
```typescript
import { writable } from 'svelte/store';
import type { User } from 'firebase/auth';
import { auth } from '$lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const user = writable<User | null>(null);
export const loading = writable(true);

onAuthStateChanged(auth, (currentUser) => {
  user.set(currentUser);
  loading.set(false);
});
```

---

### File: `frontend/firebase.json`
```json
{
  "hosting": {
    "public": "build",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

---

### File: `frontend/package.json`
```json
{
  "name": "arcano-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && firebase deploy"
  },
  "devDependencies": {
    "@sveltejs/adapter-auto": "^3.0.0",
    "@sveltejs/kit": "^2.0.0",
    "svelte": "^5.0.0",
    "vite": "^5.0.0",
    "tailwindcss": "^3.0.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0"
  },
  "dependencies": {
    "firebase": "^10.0.0",
    "marked": "^11.0.0"
  },
  "type": "module"
}
```

---

### File: `frontend/src/routes/+layout.svelte`
```svelte
<script lang="ts">
  import { page } from '$app/stores';
  import { user, loading } from '$lib/stores/auth';
  import { auth } from '$lib/firebase';
  import { signOut } from 'firebase/auth';
  import { goto } from '$app/navigation';
  import '../app.css';

  async function handleLogout() {
    try {
      await signOut(auth);
      goto('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
</script>

{#if $loading}
  <div class="min-h-screen flex items-center justify-center bg-charcoal">
    <div class="text-shiny-silver">Loading...</div>
  </div>
{:else if !$user && $page.url.pathname !== '/login'}
  <script>
    goto('/login');
  </script>
{:else}
  <slot />
{/if}

{#if $user && $page.url.pathname !== '/login'}
  <div class="fixed bottom-4 right-4">
    <button
      on:click={handleLogout}
      class="px-4 py-2 bg-electric-blue text-white rounded-lg hover:bg-opacity-90 transition-colors"
    >
      Logout
    </button>
  </div>
{/if}
```

---

## Next Steps

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Set up Firebase:
```bash
npm install -g firebase-tools
firebase login
firebase init
```

3. Configure environment variables:
Create `.env` file in frontend directory with Firebase configuration.

4. Start development server:
```bash
npm run dev
```

5. Deploy to Firebase:
```bash
npm run deploy
```

The FastAPI backend configuration is preserved in the `backend/` directory for future use when needed.
