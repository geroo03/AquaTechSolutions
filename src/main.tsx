import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/montserrat/wght.css';
import App from './App.tsx';
import { initAnalytics } from './analytics';
import './index.css';

const root = document.getElementById('root')!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);

// En producción el HTML viene pre-renderizado (scripts/prerender.mjs): se hidrata.
// En desarrollo #root está vacío: se renderiza desde cero.
if (root.firstElementChild) hydrateRoot(root, app);
else createRoot(root).render(app);

initAnalytics();
