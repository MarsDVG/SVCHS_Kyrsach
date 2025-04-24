import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage';
import LoginPage from './components/LoginPage';
import FAQPage from './components/FAQPage';
import Layout from './components/Layout';
import CompanyManagementPage from './pages/CompanyManagementPage';
import CompanyStore from './stores/CompanyStore';
import RegistrationPage from './components/RegistrationPage';
import AdminIndexPage from './pages/AdminIndexPage';
import CarManagementPage from './pages/CarManagementPage';
import UserManagementPage from './pages/UserManagementPage';
import CompanyListPage from './pages/CompanyListPage';
import OrderCreatePage from "./pages/OrderCreatePage";
import ProfilePage from './pages/ProfilePage';
import authStore from './stores/AuthStore';
import PromotionsPage from './pages/PromotionsPage';
import CompanyRatingsPage from './pages/CompanyRatingsPage';
import UserOrdersPage from './pages/UserOrdersPage';
import DriversManagementPage from './pages/DriversManagementPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/company-management" element={<CompanyManagementPage store={CompanyStore} />} />
          <Route path="/car-management" element={<CarManagementPage />} />
          <Route path="/user-management" element={<UserManagementPage />} />
          <Route path="/admin" element={<AdminIndexPage />} />
          <Route path="/companies" element={<CompanyListPage authStore={authStore} />} />
          <Route path="/order/create/:companyId" element={<OrderCreatePage authStore={authStore} />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/promotions" element={<PromotionsPage />} />
          <Route path="/company-ratings" element={<CompanyRatingsPage />} />
          <Route path="/user-orders" element={<UserOrdersPage authStore={authStore} />} />
          <Route path="/drivers-management" element={<DriversManagementPage />} />
          <Route path="/" element={<MainPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
