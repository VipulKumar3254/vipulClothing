import Link from "next/link";

const categories = [["Jackets", "/jackets"], ["Jeans", "/jeans-for-men"], ["Shirts", "/shirts-for-men"], ["T-Shirts", "/tshirts-for-men"], ["Joggers", "/joggers-for-men"]];
export default function StoreFooter() {
  return <footer className="store-footer">
    <div className="store-footer-grid">
      <div className="store-footer-brand"><Link href="/" className="store-footer-wordmark">KUMAR<span>FASHION STORE</span></Link><p>Everyday essentials, made for your way.</p><Link href="/contact" className="store-footer-contact">Get in touch <span>↗</span></Link></div>
      <div><h3>Products &amp; Services</h3>{categories.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}</div>
      <div><h3>About Us</h3><Link href="/newArrivals">New arrivals</Link><Link href="/allDeals">Today’s deals</Link><Link href="/about">Our story</Link><Link href="/contact">Contact</Link></div>
      <div className="store-footer-address"><h3>Our Store</h3><p>Gyaspur, Sonipat<br/>Haryana, India</p><a href="mailto:vipulkumar3254@gmail.com">vipulkumar3254@gmail.com</a><a href="tel:+918307949189">+91 83079 49189</a></div>
    </div>
    <div className="store-footer-mobile">
      <div className="store-footer-intro"><Link href="/" className="store-footer-wordmark">Kumar Fashion</Link></div>
      <details><summary>Categories</summary>{categories.map(([label,href])=><Link key={href} href={href}>{label}</Link>)}</details>
      <details><summary>Store information</summary><Link href="/about">Our story</Link><Link href="/privacyPolicy">Privacy policy</Link><Link href="/termsConditions">Terms &amp; conditions</Link></details>
      <details><summary>Contact details</summary><Link href="/contact">Gyaspur, Sonipat, Haryana</Link><a href="tel:+918307949189">+91 83079 49189</a><a href="mailto:vipulkumar3254@gmail.com">vipulkumar3254@gmail.com</a></details>
    </div>
    <div className="store-footer-bottom"><span>© {new Date().getFullYear()} Kumar Fashion Store. Handcrafted elegance.</span><div><Link href="/privacyPolicy">Privacy</Link><Link href="/termsConditions">Terms</Link></div><span>Made for everyday</span></div>
    <nav className="store-bottom-nav" aria-label="Quick navigation"><Link href="/"><i className="bi bi-house-door"/><span>Home</span></Link><Link href="/newArrivals"><i className="bi bi-grid"/><span>Category</span></Link><Link href="/wishList"><i className="bi bi-heart"/><span>Saved</span></Link><Link href="/profile"><i className="bi bi-person"/><span>Account</span></Link></nav>
  </footer>;
}
