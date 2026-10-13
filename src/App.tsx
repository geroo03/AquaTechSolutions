import React, { useState } from 'react';
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
import { QuoteCalculatorModal } from './components/QuoteCalculatorModal';
import { DiagnosticModal } from './components/DiagnosticModal';
import { WarrantyModal } from './components/WarrantyModal';

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
    <div className="min-h-screen bg-[#f7f9fb] font-['Inter',sans-serif] text-[#191c1e] flex flex-col selection:bg-[#4cb2ff]/20 selection:text-[#00263f]">
      {/* Fixed Header */}
      <Header 
        onOpenQuote={() => {
          setQuoteInitialService(undefined);
          setIsQuoteOpen(true);
        }}
        onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
        onOpenWarranty={() => setIsWarrantyOpen(true)}
      />

      {/* Main Content Area */}
      <main className="w-full pt-20 flex-1">
        {/* 1. Hero Section */}
        <Hero 
          onOpenQuote={() => {
            setQuoteInitialService(undefined);
            setIsQuoteOpen(true);
          }}
          onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
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

      {/* Interactive Modals */}
      <QuoteCalculatorModal 
        isOpen={isQuoteOpen}
        onClose={() => setIsQuoteOpen(false)}
        initialService={quoteInitialService}
      />

      <DiagnosticModal 
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
      />

      <WarrantyModal 
        isOpen={isWarrantyOpen}
        onClose={() => setIsWarrantyOpen(false)}
      />
    </div>
  );
}
