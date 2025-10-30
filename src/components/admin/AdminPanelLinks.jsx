"use client";

// import "@fontsource/roboto";
import "@fontsource-variable/jost";
import { useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import dashboardPng from "@/../public/dashboardPng.png";
import "@/styles/adminPanelLinks.css"; // Custom CSS

export default function AdminPanelLinks({ onLinkClick, king }) {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const sidebarRef = useRef(null);

  const router = useRouter();
  const pathname = usePathname(); // Detect current route

  const handleClick = (path) => {
    if (window.innerWidth < 768) {
      setSidebarVisible(false);
    }
    router.push(path);
  };

  // Swipe gesture state
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    if (touchStartX - touchEndX > 50) {
      setSidebarVisible(false); // swipe left to close
    }
  };

  // Helper function for active class
  const isActive = (path) => pathname === path;

  return (
    <>
      <div className="d-block d-md-none bg-white border-bottom p-2">
        <button
          className="btn btn-outline-secondary"
          onClick={() => setSidebarVisible(!sidebarVisible)}
        >
          <i className="bi bi-list fs-4"></i>
        </button>
      </div>

      <div
        className={`custom-sidebar ${sidebarVisible ? "visible" : ""} bg-dark`}
        ref={sidebarRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="text-center p-3">
          {/* Dashboard */}
          <div
            className={`d-flex align-items-center btn ${
              isActive("/adminPanel") ? "active-link" : ""
            }`}
            onClick={() => handleClick("/adminPanel")}
          >
            <div className="p-1">
              <Image
                src={dashboardPng}
                alt="Dashboard"
                style={{ height: "24px", width: "auto" }}
                className="img-fluid"
              />
            </div>
            <p className="fw-bold fs-4 p-0 m-0 ms-2 text-white">Dashboard</p>
          </div>

          {/* Menu Buttons */}
          <div
            className="d-flex mt-2 justify-content-center align-items-start gap-3 flex-column sidebar-scroll p-0"
            style={{ fontFamily: "roboto" }}
          >
            {[
              { path: "/adminPanel/upload", icon: " bi-plus-circle", label: "Add Product" },
              { path: "/adminPanel/allProducts", icon: "bi-box-seam", label: "All Products" },
              { path: "/adminPanel/orders", icon: "bi-receipt-cutoff", label: "All Orders" },
              { path: "/adminPanel/queries", icon: "bi-chat-left-text", label: "User Queries" },
              { path: "/adminPanel/users", icon: "bi-people", label: "Customers" },
              { path: "/adminPanel/categories", icon: "bi-tags", label: "Categories" },
              { path: "/adminPanel/manageNewArrivals", icon: "bi-stars", label: "New Arrivals" },
              { path: "/adminPanel/links", icon: "bi-link-45deg", label: "NavLinks" },
              { path: "/adminPanel/productsWeOffer", icon: "bi-gift", label: "Products We Offer" },
            ].map(({ path, icon, label }) => (
              <button
                key={path}
                style={{ fontSize: "19px" }}
                onClick={() => handleClick(path)}
                className={`btn fw-normal text-white ${
                  isActive(path) ? "active-link" : "btn-dark-subtle"
                }`}
              >
                <i className={`bi ${icon} me-2`}></i>
                {label}
              </button>
            ))}

            {/* Close button */}
            <button
              className="btn btn-outline-danger mt-3 d-md-none"
              onClick={() => setSidebarVisible(false)}
            >
              <i className="bi bi-x-circle me-2"></i>Close Menu
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
