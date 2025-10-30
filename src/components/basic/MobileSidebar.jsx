"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRef, useState } from "react";
import { Menu, Close, ShoppingCart, Person } from "@mui/icons-material";
import Cart from "@/components/basic/cart";
import "@/styles/cart.css";

export default function MobileSidebar({ logo, links }) {
  const [open, setOpen] = useState(false);
  const [showCart, setShowCart] = useState(true);
  const cartReference = useRef();
  const toggleCart = () => cartReference.current.classList.toggle("slide-in");

  return (
    <>
      {/* Mobile Topbar */}
      <div className="mobile-topbar">
        {/* Left: Hamburger */}
        <button onClick={() => setOpen(true)} className="hamburger-btn">
          <Menu fontSize="large" />
        </button>

        {/* Center: Logo */}
        <Link href="/" className="mobile-logo">
          <Image src={logo} alt="Logo" width={110} height={35} />
        </Link>

        {/* Right: Icons */}
        <div className="mobile-icons">
          <Link href="/profile" className="icon-btn">
            <Person fontSize="medium" />
          </Link>
          <div className="icon-btn" onClick={toggleCart}>
            <ShoppingCart fontSize="medium" />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      {open && (
        <motion.div
          className="mobile-sidebar"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "tween", duration: 0.3 }}
        >
          <button className="close-btn" onClick={() => setOpen(false)}>
            <Close fontSize="large" />
          </button>
          <ul className="sidebar-links">
            {links.map((link) => (
              <li key={link.id}>
                <Link href={link.path} onClick={() => setOpen(false)}>
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </motion.div>
      )}
     <div ref={cartReference} className="cart-container"> {showCart && <Cart toggleCart={toggleCart} />} </div>
    </>
  );
}
