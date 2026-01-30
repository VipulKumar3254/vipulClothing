"use client";

import "@fontsource-variable/jost";
import Link from "next/link";

const Footer = () => {
  return (
    <>
    <footer
      className="footer bg-dark pt-5"
      style={{ color: "white", minHeight: "400px" }}
    >
      <div style={{fontFamily:"Jost Variable"}} className="container">
        <div className="row">
          {/* Product Categories */}
          <div className="col-md-3 d-none d-md-block">
            <h5 className="fw-normal">Product Categories</h5>
            <ul className="list-unstyled">
              <li>
                <Link href="/jeans-for-men" className="link-underline-dark link-secondary">
                  Jeans
                </Link>
              </li>
              <li>
                <Link href="/shirts-for-men" className="link-underline-dark link-secondary">
                  Shirts
                </Link>
              </li>
              <li>
                <Link href="/tshirts-for-men" className="link-underline-dark link-secondary">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/joggers-for-men" className="link-underline-dark link-secondary">
                  Joggers
                </Link>
              </li>
                <li>
                <Link href="/jackets" className="link-underline-dark link-secondary">
                  Jackets
                </Link>
              </li>
            </ul>
          </div>

          {/* Community Links */}
          <div className="col-md-3">
            <h5 className="fw-normal">Join Our Community</h5>
            <ul className="list-unstyled">
              <li>
                <Link
                  href="https://www.instagram.com/vipulkumar_3254/"
                  target="_blank"
                  className="link-underline-dark link-secondary"
                  >
                  Instagram
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="col-md-3">
            <h5 className="fw-normal">Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link href="/" className="link-underline-dark link-secondary">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="link-underline-dark link-secondary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="link-underline-dark link-secondary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacyPolicy" className="link-underline-dark link-secondary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/termsConditions" className="link-underline-dark link-secondary">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/adminPanel"
                  target="_blank"
                  className="link-underline-dark link-secondary"
                >
                  Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-md-3 d-none d-md-block">
            <h5 className="fw-normal">Contact Us</h5>
            <p className="m-0 fs-5">Kumar Fashion Store</p>
            <p className="m-0">Gyaspur, Sonipat Haryana</p>
            <p className="m-0">Email: vipulkumar3254@gmail.com</p>
            <p className="m-0">Phone: +91 8307949189</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mt-5">
              <p className="text-center">
                &copy; 2024 Kumar Fashion Store All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>

                  </>
  );
};

export default Footer;
