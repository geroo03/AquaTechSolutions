import { lazy, Suspense, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { BeforeAfterSection } from './components/BeforeAfterSection';
import { ProcessSection } from './components/ProcessSection';
import { WarrantySection } from './components/WarrantySection';
import { CoverageZonesSection } from './components/CoverageZonesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { FaqSection } from './components/FaqSection';
import { CallToAction } from './components/CallToAction';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';

// Los modales se descargan recién cuando se abren por primera vez
const QuoteCalculatorModal = lazy(() =>
  import('./components/QuoteCalculatorModal').then((m) => ({ default: m.QuoteCalculatorModal })),
);
const DiagnosticModal = lazy(() => import('./components/DiagnosticModal').then((m) => ({ default: m.DiagnosticModal })));
const WarrantyModal = lazy(() => import('./components/WarrantyModal').then((m) => ({ default: m.WarrantyModal })));

export default function App() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [isWarrantyOpen, setIsWarrantyOpen] = useState(false);
  const [quoteInitialService, setQuoteInitialService] = useState<string | undefined>(undefined);

  const handleOpenQuoteWithService = (serviceName: string) => {
    setQuoteInitialService(serviceName);
    setIsQuoteOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Fixed Header */}
      <Header 
        onOpenQuote={() => {
          setQuoteInitialService(undefined);
          setIsQuoteOpen(true);
        }}
        onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
      />

      {/* Main Content Area */}
      <main className="w-full flex-1">
        {/* 1. Hero Section */}
        <Hero 
          onOpenQuote={() => {
            setQuoteInitialService(undefined);
            setIsQuoteOpen(true);
          }}
        />

        {/* 2. Services Section */}
        <ServicesSection 
          onSelectServiceForQuote={handleOpenQuoteWithService}
        />

        {/* 3. Before and After Case Studies with Comparison Slider */}
        <BeforeAfterSection />

        {/* 4. How We Work Process */}
        <ProcessSection 
          onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
        />

        {/* 5. Written Warranty & Certificate Preview */}
        <WarrantySection 
          onOpenWarrantyModal={() => setIsWarrantyOpen(true)}
        />

        {/* 6. Coverage Zones & Regional Presence */}
        <CoverageZonesSection />

        {/* 7. Client Reviews & Testimonials */}
        <TestimonialsSection />

        {/* 8. Frequently Asked Questions Accordion */}
        <FaqSection />

        {/* 9. Final High-Conversion CTA */}
        <CallToAction />
      </main>

      {/* Footer */}
      <Footer 
        onOpenWarrantyModal={() => setIsWarrantyOpen(true)}
      />

      {/* Sticky Floating WhatsApp Assistant */}
      <FloatingWhatsApp />

      {/* Modales (solo se montan abiertos) */}
      <Suspense fallback={null}>
        {isQuoteOpen && (
          <QuoteCalculatorModal isOpen onClose={() => setIsQuoteOpen(false)} initialService={quoteInitialService} />
        )}
        {isDiagnosticOpen && <DiagnosticModal isOpen onClose={() => setIsDiagnosticOpen(false)} />}
        {isWarrantyOpen && <WarrantyModal isOpen onClose={() => setIsWarrantyOpen(false)} />}
      </Suspense>
    </div>
  );
}
