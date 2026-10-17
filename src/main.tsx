import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/montserrat/wght.css';
import { pageForPath } from './routes';
import './index.css';

const root = document.getElementById('root')!;

async function start() {
  const page = pageForPath(window.location.pathname);
  const content = page.kind === 'home'
    ? (() => import('./App.tsx').then(({ default: App }) => <App />))
    : page.kind === 'business'
    ? (() => import('./pages/BusinessPage.tsx').then(({ default: BusinessPage }) => <BusinessPage page={page} />))
    : (() => import('./pages/DetailPage.tsx').then(({ default: DetailPage }) => <DetailPage page={page} />));
  const app = <StrictMode>{await content()}</StrictMode>;
  if (root.firstElementChild) hydrateRoot(root, app);
  else createRoot(root).render(app);
}
void start();
