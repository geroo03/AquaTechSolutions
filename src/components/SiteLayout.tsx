import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react';
import { initAnalytics } from '../analytics';
import { Header } from './Header';
import { Footer } from './Footer';
import { FloatingWhatsApp } from './FloatingWhatsApp';

const QuoteCalculatorModal = lazy(() => import('./QuoteCalculatorModal').then(m => ({ default: m.QuoteCalculatorModal })));
const DiagnosticModal = lazy(() => import('./DiagnosticModal').then(m => ({ default: m.DiagnosticModal })));

export function SiteLayout({ children, initialService, pagePath = '/' }: {
  initialService?: string;
  pagePath?: string;
  children: (actions: { openQuote: (service?: string) => void; openDiagnostic: () => void }) => ReactNode;
}) {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const [service, setService] = useState(initialService);
  useEffect(() => {
    const stop = initAnalytics();
    document.documentElement.dataset.ready = 'true';
    return stop;
  }, []);
  const openQuote = (selected?: string) => { setService(selected ?? initialService); setQuoteOpen(true); };
  const openDiagnostic = () => setDiagnosticOpen(true);
  return (
    <div className="min-h-screen flex flex-col">
      <a href={`.${pagePath}#contenido`} className="skip-link">Ir al contenido</a>
      <Header onOpenQuote={() => openQuote()} onOpenDiagnostic={openDiagnostic} />
      <main id="contenido" className="w-full flex-1">{children({ openQuote, openDiagnostic })}</main>
      <Footer />
      <FloatingWhatsApp />
      <Suspense fallback={null}>
        {quoteOpen && <QuoteCalculatorModal isOpen onClose={() => setQuoteOpen(false)} initialService={service} />}
        {diagnosticOpen && <DiagnosticModal isOpen onClose={() => setDiagnosticOpen(false)} />}
      </Suspense>
    </div>
  );
}
