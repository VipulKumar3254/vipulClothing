"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import CartClient from "@/components/basic/CartClient";
import logo from "@/../public/logo.png";

const links = [
  ["New Arrivals", "/newArrivals"],
  ["Jackets", "/jackets"],
  ["Jeans", "/jeans-for-men"],
  ["Shirts", "/shirts-for-men"],
  ["T-Shirts", "/tshirts-for-men"],
  ["Joggers", "/joggers-for-men"],
];

export default function StoreHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const pathname = usePathname();
  const isProductPage = pathname?.startsWith("/product/");
  function submitSearch(event) {
    event.preventDefault();
    const term = search.trim();
    if (term) window.location.href = `/search?search=${encodeURIComponent(term)}`;
  }

  return <header className="store-header">
    <div className="store-promo">Complimentary shipping on orders above ₹999 <span>·</span> Summer ’25 collection is here</div>
    <div className="store-header-main">
      <button className="store-icon store-menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}><i className={menuOpen ? "bi bi-x-lg" : "bi bi-list"}/></button>
      <Link href="/" className="store-brand" aria-label="Kumar Fashion Store home"><Image src={logo} alt="Kumar Fashion Store" priority/></Link>
      <nav className="store-nav" aria-label="Main navigation">{links.map(([name, href]) => <Link key={href} href={href}>{name}</Link>)}</nav>
      <form className="store-search" onSubmit={submitSearch}><i className="bi bi-search"/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products" aria-label="Search products"/></form>
      <div className="store-actions"><Link className="store-icon store-desktop-icon" href="/wishList" aria-label="Wishlist"><i className="bi bi-heart"/></Link><Link className="store-icon store-desktop-icon" href="/profile" aria-label="Account"><i className="bi bi-person"/></Link><div className="store-cart"><CartClient/></div></div>
    </div>
    {!isProductPage && <form className="store-mobile-search" onSubmit={submitSearch}><i className="bi bi-search"/><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search the collection" aria-label="Search products"/></form>}
    <nav className={`store-mobile-nav ${menuOpen ? "is-open" : ""}`} aria-label="Mobile navigation">{links.map(([name, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)}>{name}</Link>)}<Link href="/wishList" onClick={() => setMenuOpen(false)}>Wishlist</Link><Link href="/profile" onClick={() => setMenuOpen(false)}>My account</Link></nav>
  </header>;
}
