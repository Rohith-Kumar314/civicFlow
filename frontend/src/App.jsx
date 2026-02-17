import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "./context/AuthContext";

// ---------------- PUBLIC ----------------
import HomePage from "./landing_page/home/HomePage";
import AboutPage from "./landing_page/about/AboutPage";
import PricingPage from "./landing_page/pricing/PricingPage";
import ContactPage from "./landing_page/contact/ContactPage";
import PublicLayout from "./landing_page/PublicLayout";
import Login from "./landing_page/login/Login";
import Register from "./landing_page/register/Register";
import ProductsPage from "./landing_page/products/ProductsPage";

// ---------------- ADMIN ----------------
import AdminLayout from "./app_pages/admin/AdminLayout";
import AdminDashboard from "./app_pages/admin/AdminDashboard";
import ResidentsManagement from "./app_pages/admin/ResidentsManagement";
import WorkersManagement from "./app_pages/admin/WorkersManagement";
import ComplaintsManagement from "./app_pages/admin/ComplaintsManagement";
import Settings from "./app_pages/admin/Settings";

// ---------------- RESIDENT ----------------
import ResidentLayout from "./app_pages/resident/ResidentLayout";
import ResidentDashboard from "./app_pages/resident/ResidentDashboard";
import RaiseComplaint from "./app_pages/resident/RaiseComplaint";
import ComplaintHistory from "./app_pages/resident/ComplaintHistory";

// ---------------- WORKER ----------------
import WorkerLayout from "./app_pages/worker/WorkerLayout";
import WorkerDashboard from "./app_pages/worker/WorkerDashboard";
import MyTasks from "./app_pages/worker/MyTasks";
import CompletedTasks from "./app_pages/worker/CompletedTasks";

const App = () => {
  const { user, loading } = useAuth();
  const redirectToDashboard = () => user ? `/${user.role}` : "/";
  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/product" element={<ProductsPage />} />
          <Route
            path="/login"
            element={
              !user ? (
                <Login />
              ) : (
                <Navigate to={redirectToDashboard()} replace />
              )
            }
          />

          <Route
            path="/register"
            element={
              !user ? (
                <Register />
              ) : (
                <Navigate to={redirectToDashboard()} replace />
              )
            }
          />
        </Route>

        {/* ================= ADMIN ROUTES ================= */}
        <Route
          path="/admin"
          element={
            user?.role === "admin" ? <AdminLayout /> : <Navigate to="/login" />
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="residents" element={<ResidentsManagement />} />
          <Route path="workers" element={<WorkersManagement />} />
          <Route path="complaints" element={<ComplaintsManagement />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* ================= RESIDENT ROUTES ================= */}
        <Route
          path="/resident"
          element={
            user?.role === "resident" ? (
              <ResidentLayout />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route index element={<ResidentDashboard />} />
          <Route path="dashboard" element={<ResidentDashboard />} />
          <Route path="raise-complaint" element={<RaiseComplaint />} />
          <Route path="complaint-history" element={<ComplaintHistory />} />
        </Route>

        {/* ================= WORKER ROUTES ================= */}
        <Route
          path="/worker"
          element={
            user?.role === "worker" ? (
              <WorkerLayout worker={user} />
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route index element={<WorkerDashboard />} />
          <Route path="tasks" element={<MyTasks />} />
          <Route path="completed" element={<CompletedTasks />} />
        </Route>
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
