import Image from "next/image";
import Link from "next/link";

export const metadata = { title: "About Kumar Fashion Store", description: "Learn more about Kumar Fashion Store, our values, and our team." };

export default function AboutPage() {
  return <main className="store-about-page">
    <section className="store-about-hero"><div><span className="store-eyebrow">OUR STORY · KUMAR FASHION STORE</span><h1>Style for<br/><em>everyday life.</em></h1><p>Thoughtful clothing, a personal touch, and an easier way to find the pieces you’ll reach for again and again.</p><Link className="store-dark-button" href="/newArrivals">Explore the collection ↗</Link></div><div className="store-about-image"><Image src="/stitch-assets/desktop/d5232177-b576-4ccc-963b-8a51fe54633b.jpg" alt="Inside the Kumar Fashion atelier" fill sizes="50vw"/></div></section>
    <section className="store-about-copy"><span className="store-eyebrow">A NOTE FROM VIPUL</span><h2>Fashion should feel<br/><em>like it belongs to you.</em></h2><p>Hello, I’m Vipul, founder of Kumar Fashion Store. I started the store with a simple idea: make it easier to find comfortable, well chosen clothing that fits into real life. Every day, we work to make your shopping experience feel personal, straightforward, and worth coming back to.</p><p>Based in Gyaspur, Sonipat, we bring together casual essentials and expressive styles for your wardrobe. Thank you for being part of our journey.</p><Link href="/contact" className="store-story-link">Say hello ↗</Link></section>
    <section className="store-about-place"><div className="store-about-image"><Image src="/stitch-assets/desktop/1bac8022-232f-4d28-9a49-828a10be5c4e.jpg" alt="Craft and detail at the Kumar Fashion atelier" fill sizes="50vw"/></div><div><span className="store-eyebrow">ROOTED IN SONIPAT</span><h2>From our place<br/><em>to your wardrobe.</em></h2><p>Our store is based in Gyaspur, Sonipat, Haryana. We’re here to help with your shopping questions and make finding your next favourite piece feel simple.</p><Link href="/contact">Find our contact details ↗</Link></div></section>
  </main>;
}
