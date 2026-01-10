import Link from "next/link";
import Image from "next/image";
import MobileSidebar from "./MobileSidebar";

import logo from "@/../public/logo.png";
import "@/styles/nayaNav.css";

import { ShoppingCart, Person } from "@mui/icons-material";
import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import CartClient from "./CartClient";
export const dynamic = "force-dynamic";
// ✅ Server Component
export default async function Navbarr() {
  // Fetch links on server side
  const snapshot = await getDocs(collection(db, "admin", "links", "links"));
  const links = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

  return (
    <header>
      <nav className="navbar">
        {/* Desktop Navbar */}
        <div className="navbar-desktop">
          {/* Left: Logo */}
          <div className="navbar-left">
            <Link href="/">
              <Image src={logo} alt="Logo" width={120} height={40} />
            </Link>
          </div>

          {/* Center: Nav Links */}
          <ul className="navbar-center">
            {links.map((link) => (
              <li key={link.id}>
                <Link href={link.path}> {link.name}</Link>
              </li>
            ))}
          </ul>

          {/* Right: Icons */}
          <div className="navbar-right">
            <Link href="/profile" className="icon-btn">
              <Person fontSize="medium" />
            </Link>
            <div className="icon-btn">
            <CartClient/>
            </div>
          </div>
        </div>

        {/* Mobile Navbar */}
        <div className="navbar-mobile">
          <MobileSidebar logo={logo} links={links} />
        </div>
      </nav>
    </header>
  );
}
