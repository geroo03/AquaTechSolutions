import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/montserrat/wght.css';
import '../index.css';
import Gate from './Gate';

// Herramienta interna con login: no se pre-renderiza.
createRoot(document.getElementById('root')!).render(<StrictMode><Gate /></StrictMode>);
