// src/landing_page/PublicLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar";
import Footer from "./Footer";

const PublicLayout = () => {
  return (
    <>
      <PublicNavbar />
      <main className="pt-24">
        <Outlet /> {/* This renders the current page */}
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
