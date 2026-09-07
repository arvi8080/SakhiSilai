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
import { FindTailorsPage } from './pages/customer/FindTailorsPage';
import { TailorProfilePage } from './pages/customer/TailorProfilePage';
import { CreateOrderPage } from './pages/customer/CreateOrderPage';
import { OrderTrackingPage } from './pages/customer/OrderTrackingPage';
import { CustomDesignRequestPage } from './pages/customer/CustomDesignRequestPage';
import { CustomerDashboardPage } from './pages/customer/CustomerDashboardPage';
import { TailorDashboardPage } from './pages/tailor/TailorDashboardPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

const AppContent: React.FC = () => {
  const { currentRole } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedTailorId, setSelectedTailorId] = useState<string>('t_sunita');
  const [selectedDesignId, setSelectedDesignId] = useState<string | undefined>(undefined);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('ord_101');
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined);

  const handleSelectTailor = (tailorId: string) => {
    setSelectedTailorId(tailorId);
    setActiveTab('tailor_profile');
  };

  const handleBookDesign = (tailorId: string, designId?: string) => {
    setSelectedTailorId(tailorId);
    setSelectedDesignId(designId);
    setActiveTab('create_order');
  };

  const handleOrderCreated = (orderId: string) => {
    setSelectedOrderId(orderId);
    setActiveTab('order_tracking');
  };

  const handleTrackOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setActiveTab('order_tracking');
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
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Area */}
        <main className="pt-6">
          {activeTab === 'home' && (
            <Home
              setActiveTab={setActiveTab}
              onSelectTailor={handleSelectTailor}
              onSelectCategory={handleSelectCategory}
            />
          )}

          {activeTab === 'services' && (
            <ServicesPage
              setActiveTab={setActiveTab}
              onSelectCategory={handleSelectCategory}
            />
          )}

          {activeTab === 'find_tailors' && (
            <FindTailorsPage
              setActiveTab={setActiveTab}
              onSelectTailor={handleSelectTailor}
              selectedCategoryFilter={categoryFilter}
            />
          )}

          {activeTab === 'tailor_profile' && (
            <TailorProfilePage
              tailorId={selectedTailorId}
              setActiveTab={setActiveTab}
              onBookDesign={handleBookDesign}
            />
          )}

          {activeTab === 'create_order' && (
            <CreateOrderPage
              tailorId={selectedTailorId}
              preSelectedDesignId={selectedDesignId}
              setActiveTab={setActiveTab}
              onOrderCreated={handleOrderCreated}
            />
          )}

          {activeTab === 'order_tracking' && (
            <OrderTrackingPage
              orderId={selectedOrderId}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'custom_request' && (
            <CustomDesignRequestPage
              setActiveTab={setActiveTab}
              onOrderCreated={handleOrderCreated}
            />
          )}

          {activeTab === 'dashboard' && (
            <>
              {currentRole === 'customer' && (
                <CustomerDashboardPage
                  setActiveTab={setActiveTab}
                  onTrackOrder={handleTrackOrder}
                />
              )}

              {currentRole === 'tailor' && (
                <TailorDashboardPage
                  setActiveTab={setActiveTab}
                />
              )}

              {currentRole === 'admin' && (
                <AdminDashboardPage
                  setActiveTab={setActiveTab}
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
