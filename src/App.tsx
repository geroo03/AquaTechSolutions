import { SiteLayout } from './components/SiteLayout';
import { Hero } from './components/Hero';
import { PromoSection } from './components/PromoSection';
import { ServicesSection } from './components/ServicesSection';
import { BeforeAfterSection } from './components/BeforeAfterSection';
import { ProcessSection } from './components/ProcessSection';
import { WorkGallerySection } from './components/WorkGallerySection';
import { WarrantySection } from './components/WarrantySection';
import { CoverageZonesSection } from './components/CoverageZonesSection';
import { TestimonialSection } from './components/TestimonialSection';
import { FaqSection } from './components/FaqSection';
import { CallToAction } from './components/CallToAction';

export default function App() {
  return (
    <SiteLayout>{({ openQuote, openDiagnostic }) => <>
        <Hero onOpenQuote={() => openQuote()} />
        <PromoSection />
        <ServicesSection onSelectServiceForQuote={openQuote} />
        <BeforeAfterSection />
        <ProcessSection onOpenDiagnostic={openDiagnostic} />
        <WorkGallerySection />
        <WarrantySection />
        <CoverageZonesSection />
        <TestimonialSection />
        <FaqSection />
        <CallToAction />
    </>}</SiteLayout>
  );
}
