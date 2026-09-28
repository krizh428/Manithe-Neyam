import { useCallback, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AdminDataProvider } from './context/AdminDataContext';
import { ThemeProvider } from './context/ThemeContext';
import { useScrollSpy } from './hooks/useScrollSpy';
import type { SectionId } from './types';

// Common Components
import { Preloader } from './components/Common/Preloader';
import { ScrollProgress } from './components/Common/ScrollProgress';
import { BackToTop } from './components/Common/BackToTop';
import { AmbientGlow } from './components/Common/AmbientGlow';
import FloatingObjects from './components/Common/FloatingObjects';
import { FloatingSupport } from './components/Common/FloatingSupport';

// Navbar & Footer
import { Navbar } from './components/Navbar/Navbar';
import { Footer } from './components/Footer/Footer';

// Modals
import { SupportModal } from './components/Modals/SupportModal';

// Homepage Sections (in exact required order)
import { Hero } from './sections/Hero';
import { Introduction } from './sections/Introduction';
import { Locations } from './sections/Locations';
import { Services } from './sections/Services';
import { Founder } from './sections/Founder';
import { VisionMission } from './sections/VisionMission';
import { Activities } from './sections/Activities';
import { GalleryPreview } from './sections/GalleryPreview';
import { Statistics } from './sections/Statistics';
import { CallToAction } from './sections/CallToAction';
import { Contact } from './sections/Contact';

const TRACKED_SECTIONS: SectionId[] = [
  'hero',
  'about',
  'locations',
  'services',
  'activities',
  'gallery',
  'stats',
  'documents',
  'contact',
];

function MainContent() {
  const activeSection = useScrollSpy(TRACKED_SECTIONS, 120);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
  const navigate = useNavigate();
  const [siteReady, setSiteReady] = useState(false);
  const handlePreloaderDone = useCallback(() => setSiteReady(true), []);

  const handleOpenSupport = () => {
    setIsSupportModalOpen(true);
  };

  const handleCloseSupport = () => {
    setIsSupportModalOpen(false);
  };

  // Admin lives on its own page (/admin); it redirects to the login page when signed out
  const handleOpenAdmin = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen flex flex-col bg-theme-bg text-theme-text relative selection:bg-theme-bg selection:text-theme-text">
      {/* 1. Preloader */}
      <Preloader onComplete={handlePreloaderDone} />

      {/* Dynamic Ambient Glow and Floating Objects */}
      <FloatingObjects />
      <AmbientGlow />

      {/* Top Scroll Reading Progress */}
      <ScrollProgress />

      {/* 2. Sticky Navbar */}
      <Navbar activeSection={activeSection} onOpenSupport={handleOpenSupport} onOpenAdmin={handleOpenAdmin} />

      {/* Main Sections */}
      <main className="flex-grow">
        {/* 3. Hero */}
        <Hero onOpenSupport={handleOpenSupport} />

        {/* 4. Introduction */}
        <Introduction />

        {/* 5. Three Home Locations */}
        <Locations onOpenSupport={handleOpenSupport} />

        {/* 6. Our Services */}
        <Services />

        {/* 7. Founder */}
        <Founder />

        {/* 8. Vision & Mission */}
        <VisionMission />

        {/* 9. Service Activities */}
        <Activities />

        {/* 10. Gallery Preview */}
        <GalleryPreview />

        {/* 11. Statistics */}
        <Statistics />

        {/* 12. Documents */}
        <PublicDocuments />

        {/* 13. Call To Action */}
        <CallToAction onOpenSupport={handleOpenSupport} />

        {/* 13. Contact */}
        <Contact />
      </main>

      {/* 14. Footer */}
      <Footer />

      {/* 15. Back To Top */}
      <BackToTop />

      {/* Announcement popup (only appears when the admin has published an active announcement) */}
      <AnnouncementPopup ready={siteReady} />

      {/* 16. Floating Support */}
      <FloatingSupport onClick={handleOpenSupport} />

      {/* Support / Volunteer Inquiry Modal */}
      <SupportModal isOpen={isSupportModalOpen} onClose={handleCloseSupport} />
    </div>
  );
}

import { Login } from './admin/Login';
import { AdminDashboard } from './admin/AdminDashboard';
import { UnsavedChangesBar } from './components/Admin/UnsavedChangesBar';
import { AnnouncementPopup } from './components/Announcement/AnnouncementPopup';
import { PublicDocuments } from './sections/PublicDocuments';

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AdminDataProvider>
          <Router>
            <Routes>
              <Route path="/" element={<MainContent />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<Login />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/:tab" element={<AdminDashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
          <UnsavedChangesBar />
        </AdminDataProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;
