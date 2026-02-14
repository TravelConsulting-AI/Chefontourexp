import { BrowserRouter, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';
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
import { AccountPage } from './pages/AccountPage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ExperienceRouter } from './pages/ExperienceRouter';

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior
    });
  }, [pathname]);

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

/** Layout with header + footer (all regular pages) */
function ShellLayout() {
  return (
    <div className="relative min-h-screen bg-white overflow-x-hidden">
      <ChefHeader />
      <Outlet />
      <ChefFooter />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          {/* ── Auth pages (no header / footer) ── */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* ── Shell layout (header + footer) ── */}
          <Route element={<ShellLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            {/* Canonical experience routes */}
            <Route path="/experiences" element={<ExperiencesPage />} />
            <Route path="/experiences/:canonicalSlug" element={<ExperienceRouter />} />

            {/* Legacy redirects → canonical URLs */}
            <Route path="/tours" element={<Navigate to="/experiences/barcelona" replace />} />
            <Route path="/medellin-tours" element={<Navigate to="/experiences/medellin" replace />} />
            <Route path="/buenos-aires-tours" element={<Navigate to="/experiences/buenos-aires" replace />} />
            <Route path="/rio-tours" element={<Navigate to="/experiences/rio" replace />} />
            <Route path="/palermo-tours" element={<Navigate to="/experiences/palermo" replace />} />
            <Route path="/malaga-tours" element={<Navigate to="/experiences/malaga" replace />} />
            <Route path="/istanbul-tours" element={<Navigate to="/experiences/istanbul" replace />} />
            <Route path="/beirut-tours" element={<Navigate to="/experiences/beirut" replace />} />
            <Route path="/team" element={<TeamPage />} />
            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['superadmin', 'leadership']}>
                  <AdminPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
        <Toaster position="bottom-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}