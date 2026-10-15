import { lazy, Suspense, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PromoSection } from './components/PromoSection';
import { ServicesSection } from './components/ServicesSection';
import { BeforeAfterSection } from './components/BeforeAfterSection';
import { ProcessSection } from './components/ProcessSection';
import { WarrantySection } from './components/WarrantySection';
import { CoverageZonesSection } from './components/CoverageZonesSection';
import { FaqSection } from './components/FaqSection';
import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

// Los modales se descargan recién cuando se abren por primera vez
const QuoteCalculatorModal = lazy(() =>
  import('./components/QuoteCalculatorModal').then((m) => ({ default: m.QuoteCalculatorModal })),
);
const DiagnosticModal = lazy(() => import('./components/DiagnosticModal').then((m) => ({ default: m.DiagnosticModal })));

export default function App() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [quoteInitialService, setQuoteInitialService] = useState<string | undefined>(undefined);

  const openQuote = (service?: string) => {
    setQuoteInitialService(service);
    setIsQuoteOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header onOpenQuote={() => openQuote()} onOpenDiagnostic={() => setIsDiagnosticOpen(true)} />

      <main className="w-full flex-1">
        <Hero onOpenQuote={() => openQuote()} />
        <PromoSection />
        <ServicesSection onSelectServiceForQuote={openQuote} />
        <BeforeAfterSection />
        <ProcessSection onOpenDiagnostic={() => setIsDiagnosticOpen(true)} />
        <WarrantySection />
        <CoverageZonesSection />
        {/* Testimonios: vuelven cuando haya reseñas reales en Google */}
        <FaqSection />
        <CallToAction />
      </main>

      <Footer />
      <FloatingWhatsApp />

      {/* Modales (solo se montan abiertos) */}
      <Suspense fallback={null}>
        {isQuoteOpen && (
          <QuoteCalculatorModal isOpen onClose={() => setIsQuoteOpen(false)} initialService={quoteInitialService} />
        )}
        {isDiagnosticOpen && <DiagnosticModal isOpen onClose={() => setIsDiagnosticOpen(false)} />}
      </Suspense>
    </div>
  );
}
