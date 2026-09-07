import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { LanguageProvider } from './context/LanguageContext';
import { RoleSwitcherBar } from './components/common/RoleSwitcherBar';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';

// Pages
import { Home } from './pages/public/Home';
import { ServicesPage } from './pages/public/ServicesPage';
import { HowItWorksPage } from './pages/public/HowItWorksPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { AuthPages } from './pages/public/AuthPages';
import { FindTailorsPage } from './pages/customer/FindTailorsPage';
import { TailorProfilePage } from './pages/customer/TailorProfilePage';
import { CreateOrderPage } from './pages/customer/CreateOrderPage';
import { OrderTrackingPage } from './pages/customer/OrderTrackingPage';
import { CustomDesignRequestPage } from './pages/customer/CustomDesignRequestPage';
import { CustomerDashboardPage } from './pages/customer/CustomerDashboardPage';
import { TailorDashboardPage } from './pages/tailor/TailorDashboardPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

const PROTECTED_TABS = ['create_order', 'custom_request', 'order_tracking', 'dashboard', 'admin_dashboard'];

const AppContent: React.FC = () => {
  const { currentRole, isLoggedIn, setPendingRedirectTab, setPendingTailorId, setRedirectNotice } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedTailorId, setSelectedTailorId] = useState<string>('t_sunita');
  const [selectedDesignId, setSelectedDesignId] = useState<string | undefined>(undefined);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('ord_101');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);

  const handleNavigate = (tab: string, extraData?: { tailorId?: string; designId?: string; orderId?: string }) => {
    // Check if target tab is protected and user is not logged in
    if (!isLoggedIn && PROTECTED_TABS.includes(tab)) {
      setPendingRedirectTab(tab);
      if (extraData?.tailorId) {
        setPendingTailorId(extraData.tailorId);
        setSelectedTailorId(extraData.tailorId);
      } else if (selectedTailorId) {
        setPendingTailorId(selectedTailorId);
      }
      if (extraData?.designId) {
        setSelectedDesignId(extraData.designId);
      }
      
      let noticeMsg = "🔐 आगे बढ़ने के लिए कृपया पहले लॉगिन या पंजीकरण करें (Please login or register to continue)";
      if (tab === 'create_order') {
        noticeMsg = "🔐 'Book Now' / सिलाई ऑर्डर बुक करने के लिए कृपया पहले लॉगिन या खाता बनाएं (Please login to book an order)";
      } else if (tab === 'custom_request') {
        noticeMsg = "🔐 कस्टम डिज़ाइन अपलोड करने के लिए कृपया पहले लॉगिन करें (Please login to upload custom design)";
      } else if (tab === 'order_tracking') {
        noticeMsg = "🔐 अपने पर्सनल ऑर्डर ट्रैक करने के लिए कृपया लॉगिन करें (Please login to track your orders)";
      } else if (tab === 'dashboard') {
        noticeMsg = "🔐 डैशबोर्ड या प्रोफ़ाइल देखने के लिए कृपया लॉगिन करें (Please login to access dashboard)";
      }
      setRedirectNotice(noticeMsg);
      setActiveTab('auth');
      return;
    }

    // Direct navigation if public or logged in
    if (extraData?.tailorId) setSelectedTailorId(extraData.tailorId);
    if (extraData?.designId !== undefined) setSelectedDesignId(extraData.designId);
    if (extraData?.orderId) setSelectedOrderId(extraData.orderId);

    setActiveTab(tab);
  };

  const handleSelectTailor = (tailorId: string) => {
    setSelectedTailorId(tailorId);
    setActiveTab('tailor_profile');
  };

  const handleBookDesign = (tailorId: string, designId?: string) => {
    handleNavigate('create_order', { tailorId, designId });
  };

  const handleOrderCreated = (orderId: string) => {
    setSelectedOrderId(orderId);
    handleNavigate('order_tracking', { orderId });
  };

  const handleTrackOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    handleNavigate('order_tracking', { orderId });
  };

  const handleSelectCategory = (catId: string) => {
    setCategoryFilter(catId);
    setActiveTab('find_tailors');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-stone-800 flex flex-col justify-between selection:bg-[#D9534F] selection:text-white">
      <div>
        {/* Quick Role Switcher Bar for Demo */}
        <RoleSwitcherBar />

        {/* Navigation Bar */}
        <Navbar activeTab={activeTab} setActiveTab={handleNavigate} />

        {/* Main Content Area */}
        <main className="pt-6">
          {activeTab === 'home' && (
            <Home
              setActiveTab={handleNavigate}
              onSelectTailor={handleSelectTailor}
              onSelectCategory={handleSelectCategory}
            />
          )}

          {activeTab === 'services' && (
            <ServicesPage
              setActiveTab={handleNavigate}
              onSelectCategory={handleSelectCategory}
            />
          )}

          {activeTab === 'how_it_works' && (
            <HowItWorksPage
              setActiveTab={handleNavigate}
            />
          )}

          {activeTab === 'about' && (
            <AboutPage setActiveTab={handleNavigate} />
          )}

          {activeTab === 'contact' && (
            <ContactPage />
          )}

          {activeTab === 'auth' && (
            <AuthPages
              setActiveTab={handleNavigate}
              initialMode="register_tailor"
            />
          )}

          {activeTab === 'find_tailors' && (
            <FindTailorsPage
              setActiveTab={handleNavigate}
              onSelectTailor={handleSelectTailor}
              selectedCategoryFilter={categoryFilter}
            />
          )}

          {activeTab === 'tailor_profile' && (
            <TailorProfilePage
              tailorId={selectedTailorId}
              setActiveTab={handleNavigate}
              onBookDesign={handleBookDesign}
            />
          )}

          {activeTab === 'create_order' && (
            <CreateOrderPage
              tailorId={selectedTailorId}
              preSelectedDesignId={selectedDesignId}
              setActiveTab={handleNavigate}
              onOrderCreated={handleOrderCreated}
            />
          )}

          {activeTab === 'order_tracking' && (
            <OrderTrackingPage
              orderId={selectedOrderId}
              setActiveTab={handleNavigate}
            />
          )}

          {activeTab === 'custom_request' && (
            <CustomDesignRequestPage
              setActiveTab={handleNavigate}
              onOrderCreated={handleOrderCreated}
            />
          )}

          {activeTab === 'dashboard' && (
            <>
              {currentRole === 'customer' && (
                <CustomerDashboardPage
                  setActiveTab={handleNavigate}
                  onTrackOrder={handleTrackOrder}
                />
              )}

              {currentRole === 'tailor' && (
                <TailorDashboardPage
                  setActiveTab={handleNavigate}
                />
              )}

              {currentRole === 'admin' && (
                <AdminDashboardPage
                  setActiveTab={handleNavigate}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <DataProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </DataProvider>
    </LanguageProvider>
  );
}
