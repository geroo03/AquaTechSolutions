import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/montserrat/wght.css';
import '../index.css';
import BudgetApp from './BudgetApp';

// Herramienta interna: no se pre-renderiza (lee el guardado del navegador al arrancar).
createRoot(document.getElementById('root')!).render(<StrictMode><BudgetApp /></StrictMode>);
