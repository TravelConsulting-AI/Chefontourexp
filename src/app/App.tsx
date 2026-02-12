import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ChefHeader } from './components/chef-on-tour/ChefHeader';
import { VideoHero } from './components/chef-on-tour/VideoHero';
import { WhySection } from './components/chef-on-tour/WhySection';
import { FeaturedDestinationsSection } from './components/chef-on-tour/FeaturedDestinationsSection';
import { WhatIDoSection } from './components/chef-on-tour/WhatIDoSection';
import { SignatureSection } from './components/chef-on-tour/SignatureSection';
import { PressSection } from './components/chef-on-tour/PressSection';
import { ExploreDestinations } from './components/chef-on-tour/ExploreDestinations';
import { TestimonialsHeroSection } from './components/chef-on-tour/TestimonialsHeroSection';
import { FollowSection } from './components/chef-on-tour/FollowSection';
import { TestimonialsGridSection } from './components/chef-on-tour/TestimonialsGridSection';
import { TeamGridSection } from './components/chef-on-tour/TeamGridSection';
import { Newsletter } from './components/chef-on-tour/Newsletter';
import { ContactSection } from './components/chef-on-tour/ContactSection';
import { ChefFooter } from './components/chef-on-tour/ChefFooter';
import { ToursPage } from './pages/ToursPage';
import { MedellinToursPage } from './pages/MedellinToursPage';
import { BuenosAiresToursPage } from './pages/BuenosAiresToursPage';
import { RioToursPage } from './pages/RioToursPage';
import { PalermoToursPage } from './pages/PalermoToursPage';
import { MalagaToursPage } from './pages/MalagaToursPage';
import { IstanbulToursPage } from './pages/IstanbulToursPage';
import { BeirutToursPage } from './pages/BeirulToursPage';
import { TeamPage } from './pages/TeamPage';
import { DestinationsPage } from './pages/DestinationsPage';
import { ExperiencesPage } from './pages/ExperiencesPage';

// Scroll to top component
function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Only scroll to top when pathname changes, not when search params change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior
    });
  }, [pathname]); // Only depend on pathname, not search

  return null;
}

function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <VideoHero />
        <WhySection />
        <FeaturedDestinationsSection />
        <TeamGridSection />
        <ExploreDestinations />
        <SignatureSection />
        <PressSection />
        {/* Hidden sections */}
        {/* <TestimonialsHeroSection /> */}
        <FollowSection />
        {/* <TestimonialsGridSection /> */}
        {/* <WhatIDoSection /> */}
        {/* <Newsletter /> */}
        <ContactSection />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-white overflow-x-hidden">
        <ChefHeader />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/medellin-tours" element={<MedellinToursPage />} />
          <Route path="/buenos-aires-tours" element={<BuenosAiresToursPage />} />
          <Route path="/rio-tours" element={<RioToursPage />} />
          <Route path="/palermo-tours" element={<PalermoToursPage />} />
          <Route path="/malaga-tours" element={<MalagaToursPage />} />
          <Route path="/istanbul-tours" element={<IstanbulToursPage />} />
          <Route path="/beirut-tours" element={<BeirutToursPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/experiences" element={<ExperiencesPage />} />
        </Routes>
        <ChefFooter />
      </div>
    </BrowserRouter>
  );
}