# Task: Create Vite + React Scaffold (dashboard/)

Metadata:
- Plan: dashboard-work-plan.md
- Phase: 3 (Dashboard Build Pipeline + CLI Command)
- Dependencies: None (can be built in parallel with Phase 2)
- Size: Medium (new directory with ~8 files)

## Implementation Content
Create the Vite + React project scaffold at `apps/cli/dashboard/`. This is a self-contained project with its own `package.json` (NOT an npm workspace). It includes React, React Router, Tailwind CSS v4, and the brand styling.

Reference: Design Doc build pipeline integration, styling approach.

## Target Files
- [x] `apps/cli/dashboard/package.json` (new)
- [x] `apps/cli/dashboard/vite.config.ts` (new)
- [x] `apps/cli/dashboard/tsconfig.json` (new)
- [x] `apps/cli/dashboard/index.html` (new)
- [x] `apps/cli/dashboard/src/main.tsx` (new)
- [x] `apps/cli/dashboard/src/App.tsx` (new)
- [x] `apps/cli/dashboard/src/index.css` (new)

## Implementation Steps

### 1. Create package.json
- [x] Create `apps/cli/dashboard/package.json`:
  ```json
  {
    "name": "relay-dashboard",
    "private": true,
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview"
    },
    "dependencies": {
      "react": "^19",
      "react-dom": "^19",
      "react-router-dom": "^7"
    },
    "devDependencies": {
      "@types/react": "^19",
      "@types/react-dom": "^19",
      "@vitejs/plugin-react": "^4",
      "tailwindcss": "^4",
      "@tailwindcss/vite": "^4",
      "typescript": "^5",
      "vite": "^6"
    }
  }
  ```

### 2. Create vite.config.ts
- [x] Create `apps/cli/dashboard/vite.config.ts`:
  ```typescript
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';
  import tailwindcss from '@tailwindcss/vite';

  export default defineConfig({
    plugins: [react(), tailwindcss()],
    base: '/dashboard/',
    build: {
      outDir: '../dist/dashboard',
      emptyOutDir: true,
    },
  });
  ```

### 3. Create tsconfig.json
- [x] Create `apps/cli/dashboard/tsconfig.json`:
  ```json
  {
    "compilerOptions": {
      "target": "ES2022",
      "lib": ["ES2023", "DOM", "DOM.Iterable"],
      "module": "ESNext",
      "moduleResolution": "bundler",
      "jsx": "react-jsx",
      "strict": true,
      "noEmit": true,
      "isolatedModules": true,
      "skipLibCheck": true,
      "esModuleInterop": true,
      "resolveJsonModule": true
    },
    "include": ["src"]
  }
  ```

### 4. Create index.html
- [x] Create `apps/cli/dashboard/index.html`:
  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Relay Dashboard</title>
  </head>
  <body class="bg-[#0a0a0a] text-white">
    <div id="root"></div>
    <script type="module" src="/dashboard/src/main.tsx"></script>
  </body>
  </html>
  ```

### 5. Create React Entry Points
- [x] Create `apps/cli/dashboard/src/main.tsx`:
  ```tsx
  import { StrictMode } from 'react';
  import { createRoot } from 'react-dom/client';
  import { BrowserRouter } from 'react-router-dom';
  import App from './App';
  import './index.css';

  // Extract token from URL and store in sessionStorage
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  if (token) {
    sessionStorage.setItem('relay-dashboard-token', token);
    // Remove token from URL for cleanliness
    const url = new URL(window.location.href);
    url.searchParams.delete('token');
    window.history.replaceState({}, '', url.toString());
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter basename="/dashboard">
        <App />
      </BrowserRouter>
    </StrictMode>,
  );
  ```

- [x] Create `apps/cli/dashboard/src/App.tsx`:
  ```tsx
  import { Routes, Route } from 'react-router-dom';

  function Placeholder({ name }: { name: string }) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-mono text-white/80">{name}</h1>
          <p className="text-white/40 mt-2">Coming soon</p>
        </div>
      </div>
    );
  }

  export default function App() {
    return (
      <Routes>
        <Route path="/" element={<Placeholder name="Relay Dashboard" />} />
      </Routes>
    );
  }
  ```

### 6. Create CSS
- [x] Create `apps/cli/dashboard/src/index.css`:
  ```css
  @import "tailwindcss";

  @theme {
    --color-bg: #0a0a0a;
    --color-glass: rgba(255, 255, 255, 0.05);
    --color-glass-border: rgba(255, 255, 255, 0.1);
    --color-accent-blue: #3b82f6;
    --color-accent-cyan: #06b6d4;
    --font-mono: 'JetBrains Mono', ui-monospace, monospace;
  }

  body {
    background-color: var(--color-bg);
    font-family: system-ui, -apple-system, sans-serif;
  }
  ```

### 7. Install and Build
- [x] Run `cd apps/cli/dashboard && npm install`
- [x] Run `cd apps/cli/dashboard && npx vite build` -- verify output in `apps/cli/dist/dashboard/`
- [x] Verify `apps/cli/dist/dashboard/index.html` exists

## Completion Criteria
- [x] `apps/cli/dashboard/` directory exists with all scaffold files
- [x] `npm install` succeeds in dashboard directory
- [x] `npx vite build` produces output in `apps/cli/dist/dashboard/`
- [x] `index.html` and `assets/` directory present in build output
- [x] TypeScript compiles without errors (L3: Build Success Verification)

## Notes
- Impact scope: New self-contained directory. Does not affect existing code.
- Constraints: Dashboard is NOT an npm workspace. Dependencies are installed separately.
- This task can be executed in parallel with Tasks 03-05 since it has no dependency on auth/static serving.
- The `tsc` build for the main CLI will NOT be affected since `tsconfig.json` has `rootDir: './src'`.
