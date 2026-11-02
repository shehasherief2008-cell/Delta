import React from 'react';
import { Router, Routes, Route } from './lib/router';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { DemoBar } from './components/common/DemoBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { MarketplacePage } from './pages/MarketplacePage';
import { DonationDetailPage } from './pages/DonationDetailPage';
import { DonatePage } from './pages/DonatePage';
import { PickupsPage } from './pages/PickupsPage';
import { ImpactPage } from './pages/ImpactPage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <div className="min-h-screen flex flex-col bg-sand text-charcoal">
            {/* Top Hackathon Demo Bar for Judges */}
            <DemoBar />

            {/* Platform Main Header Navbar */}
            <Navbar />

            {/* Main Page Body */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/donations" element={<MarketplacePage />} />
                <Route path="/donations/:id" element={<DonationDetailPage />} />
                <Route path="/donate" element={<DonatePage />} />
                <Route path="/pickups" element={<PickupsPage />} />
                <Route path="/impact" element={<ImpactPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/how-it-works" element={<HowItWorksPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </main>

            {/* Platform Footer */}
            <Footer />
          </div>
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;

