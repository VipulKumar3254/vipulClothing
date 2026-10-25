"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import TodayDeals from "./TodayDeals";

const D = "/stitch-assets/desktop/";
const M = "/stitch-assets/mobile/";
const photos = {
  hero: D+"1b9c56fc-5e74-4c26-bf48-c1fdbbe7aff2.jpg", heroSide: D+"457b99ea-a59f-4cb0-a610-96583816bf5d.jpg",
  summer: D+"2cf81c12-bbe7-41be-a0d0-bbf76d33f422.jpg",
  categories: [D+"40c28789-70d9-42bc-b0a8-d87ba3093f3b.jpg",D+"2c7b986d-9e2b-4335-b416-fc497db2697f.jpg",D+"75d85b0e-1139-4c6c-a0a6-e540c57bee04.jpg",D+"745937b0-2b8f-4a9b-91fe-22cb918bea94.jpg",D+"c77b482a-c961-4f0c-b947-2346b5903345.jpg"],
  offer: D+"07f0e459-4c3a-4487-b960-e3b4b7ec6b9a.jpg", atelier: D+"d5232177-b576-4ccc-963b-8a51fe54633b.jpg", craft: D+"1bac8022-232f-4d28-9a49-828a10be5c4e.jpg",
  mobileHero: M+"9e6e96c5-2818-4724-8295-e12a6e5abc69.jpg",
  mobileCategories: [M+"f117941f-31d6-4356-83dd-051aac3cda5e.jpg",M+"d83edb85-e1c7-486f-a94c-57d188e5a097.jpg",M+"7ca41614-e03e-4fdf-998f-3018b45b6d8e.jpg",M+"8a02592b-63a1-4823-98a8-8e1ca5ca28ba.jpg",M+"48a3dd97-a6e4-4bdf-bba3-a9a9c88a08ba.jpg",M+"af73bc49-a457-4dfb-a19b-a5aeec80d7cb.jpg"],
  lookbook: M+"8c4b0cd3-c792-4b47-b0df-584e5c027442.jpg",
};
const categories = [["Jackets","/jackets"],["Jeans","/jeans-for-men"],["Shirts","/shirts-for-men"],["T-Shirts","/tshirts-for-men"],["Joggers","/joggers-for-men"]];
function Heading({eyebrow,children,href,link="Explore all"}) { return <div className="store-section-heading"><div><span>{eyebrow}</span><h2>{children}</h2></div>{href&&<Link href={href}>{link} ↗</Link>}</div>; }
function FlashCountdown() { const [seconds,setSeconds]=useState(8*3600+42*60+19); useEffect(()=>{const id=setInterval(()=>setSeconds(v=>v>0?v-1:8*3600+42*60+19),1000);return()=>clearInterval(id)},[]);return <span>{[Math.floor(seconds/3600),Math.floor((seconds%3600)/60),seconds%60].map(v=>String(v).padStart(2,"0")).join(" : ")}</span>; }

export default function StoreHome() {
  const [deals,setDeals]=useState([]);
  useEffect(()=>{let live=true;(async()=>{try{const ds=await getDocs(query(collection(db,"products"),where("isDeal","==",true)));if(live)setDeals(ds.docs.map(d=>({id:d.id,...d.data()})).slice(0,4));}catch(err){console.error("Could not load storefront products",err);}})();return()=>{live=false}},[]);
  return <main className="store-home">
    <nav className="store-category-pills" aria-label="Shop categories">{["All",["T-Shirts","/tshirts-for-men"],["Joggers","/joggers-for-men"],["Shirts","/shirts-for-men"],["Jackets","/jackets"],["Jeans","/jeans-for-men"]].map((item,i)=>{const label=Array.isArray(item)?item[0]:item;const href=Array.isArray(item)?item[1]:"/";return <Link className={i===0?"is-active":""} key={label} href={href}>{label}</Link>})}</nav>

    <section className="store-hero">
      <div className="store-hero-desktop">
        <div className="store-hero-editorial"><span className="store-eyebrow">✳ &nbsp; SUMMER ’25 NEW COLLECTION LIVE</span><h1>Summer ’25<br/><em>New Collection</em></h1><p>Light and breezy fits for the season. Thoughtfully curated for those who move freely, express effortlessly, and make every day feel like a little adventure.</p><div className="store-hero-actions"><Link className="store-dark-button" href="/newArrivals">Shop now ↗</Link><Link className="store-outline-button" href="/jackets">View collection</Link></div><div className="store-hero-stats"><div><b>100%</b><span>Everyday comfort</span></div><div><b>4.9/5</b><span>Customer rating</span></div><div><b>12k+</b><span>Happy patrons</span></div></div></div>
        <Link href="/newArrivals" className="store-hero-feature-photo"><Image src={photos.hero} alt="Summer collection, earth tone layering" fill priority sizes="(max-width: 1100px) 48vw, 38vw"/><span className="store-photo-caption"><b>EARTH TONE LAYERING</b><i>↗</i></span></Link>
        <div className="store-hero-side-stack"><Link href="/about" className="store-hero-note-card"><span>THE KUMAR EDIT</span><strong>Thoughtful<br/>silhouettes.</strong><small>Made for the way you move.</small></Link><Link href="/shirts-for-men" className="store-hero-secondary-photo"><Image src={photos.heroSide} alt="Kumar Fashion summer looks" fill sizes="22vw"/><span>Explore the edit ↗</span></Link></div>
      </div>
      <div className="store-hero-mobile"><div className="store-mobile-hero-art"><Image src={photos.mobileHero} alt="Summer Vibes collection" fill priority sizes="100vw"/><div className="store-mobile-hero-tag"><i/> SUMMER ’25 DROP</div><div className="store-mobile-hero-overlay"><span>ATELIER COLLECTION</span><h1>Summer Vibes</h1><p>Light, breathable woven fits meticulously curated for effortless warm-weather tailoring.</p><div><Link href="/newArrivals">Shop now</Link><Link aria-label="Explore summer looks" href="/shirts-for-men">↗</Link></div></div></div></div>
    </section>

    <section className="store-promises"><div><span>✳</span><p><b>Thoughtful essentials</b><small>Well made, easy to wear</small></p></div><div><span>↗</span><p><b>Fast dispatch</b><small>Ready for everyday</small></p></div><div><span>⌂</span><p><b>Easy returns</b><small>10 day return window</small></p></div><div><span>♡</span><p><b>Made for you</b><small>Support from our team</small></p></div></section>

    <section className="store-section store-deals"><TodayDeals deals={deals}/></section>

    <section className="store-summer"><div className="store-summer-copy"><span className="store-eyebrow">✳ &nbsp; COMFORT CAPSULE</span><h2>Summer Vibes</h2><p>Light and breezy fits for the season. Ultra-soft breathable fleece joggers available in Forest Olive, Charcoal Bark, and Deep Navy.</p><div className="store-summer-actions"><Link className="store-dark-button" href="/joggers-for-men">Shop joggers ↗</Link><strong>Starting at ₹499</strong></div></div><div className="store-summer-photo"><Image src={photos.summer} alt="Summer Vibes joggers in seasonal colours" fill sizes="50vw"/><span>THE COMFORT CAPSULE</span></div></section>

    <section className="store-section store-shop-categories"><div className="store-category-heading"><Heading eyebrow="CURATED SELECTION" href="/newArrivals" link="All items ↗">Shop by category</Heading><p>Find your fit in our considered selection of everyday essentials.</p></div><div className="store-category-grid">{categories.map(([name,href],i)=><Link href={href} key={href} className="store-category-card"><div><Image src={photos.categories[i]} alt={`${name} collection`} fill sizes="20vw"/><span className="store-category-overlay"><b>{name}</b><i>↗</i></span></div></Link>)}</div><div className="store-category-circles">{categories.concat([["Polos","/shirts-for-men"]]).map(([name,href],i)=><Link href={href} key={`${name}-circle`}><span><Image src={photos.mobileCategories[i]} alt="" fill sizes="64px"/></span><b>{name}</b></Link>)}</div></section>

    <section className="store-offer"><div className="store-offer-photo"><Image src={photos.offer} alt="The Kumar Fashion signature offer" fill sizes="50vw"/></div><div className="store-offer-copy"><span className="store-eyebrow">✳ &nbsp; SIGNATURE MEGA OFFER</span><h2>Get any Product at<br/><em>250/- only</em></h2><p>Don’t miss the chance to upgrade your wardrobe with our affordable premium collection. Unbeatable value across selected seasonal essentials.</p><ul><li>✓ &nbsp; Thoughtful everyday selections</li><li>✓ &nbsp; Comfortable seasonal fabrics</li><li>✓ &nbsp; Easy online ordering</li></ul><Link className="store-dark-button" href="/products-under-400">Shop the offer ↗</Link></div><div className="store-mobile-flash"><span className="store-mobile-flash-label"><i/> SEASONAL FLASH OFFER</span><h2>Get any Product at <em>₹250/- only</em></h2><p>Don’t miss this chance to upgrade your wardrobe with our affordable luxury curation. Limited sizes &amp; early bird availability.</p><div className="store-flash-countdown"><small>◷ &nbsp; OFFER CLOSES IN:</small><b><FlashCountdown/></b></div><div className="store-flash-perks"><span>✳ &nbsp; SELECTED STYLES</span><span>↺ &nbsp; EASY RETURNS</span></div><Link href="/products-under-400">CLAIM OFFER NOW &nbsp; ↗</Link></div></section>

    <section className="store-mobile-lookbook"><div className="store-mobile-section-heading"><div><span>LOOKBOOK</span><h2>Curated Pairings</h2></div><button aria-label="Share lookbook" onClick={()=>{if(navigator.share)navigator.share({title:"Kumar Fashion lookbook",url:location.href}).catch(()=>{});}}>↗</button></div><article className="store-lookbook-card"><div className="store-lookbook-photo"><Image src={photos.lookbook} alt="Earth and ochre layered looks" fill sizes="100vw"/><div><span>STYLIST PICK #04</span><h3>Earth &amp; Ochre Layering</h3><p>Heavyweight twill jackets layered over mercerized cotton</p></div></div><div className="store-lookbook-footer"><span><b>#1</b><i>#2</i></span><Link href="/jackets">View complete look ↗</Link></div></article></section>

    <section className="store-story"><div className="store-story-copy"><span className="store-eyebrow">SONIPAT · HARYANA</span><h2>The Kumar Fashion Story</h2><p>Rooted in Gyaspur, Sonipat, Kumar Fashion Store was founded on a distinct philosophy: authentic Indian textile craftsmanship, refined contemporary cuts, and honest everyday pricing.</p><p>We oversee each garment from raw thread weaving to final precision stitching, eliminating markups so discerning individuals can build enduring wardrobes without compromise.</p><div className="store-story-stats"><div><b>12,000+</b><span>Happy Indian Patrons</span></div><div><b>48 Hrs</b><span>Fast dispatch</span></div></div><Link href="/about" className="store-story-link">Our story ↗</Link></div><div className="store-story-photos"><div><Image src={photos.atelier} alt="At the Kumar Fashion atelier" fill sizes="35vw"/></div><div><Image src={photos.craft} alt="Craft details at our atelier" fill sizes="24vw"/></div></div></section>

    <section className="store-mobile-atelier"><div className="store-atelier-icon">⌂</div><div><span>FLAGSHIP STORE</span><h2>Kumar Fashion Atelier</h2></div><p>Experience our bespoke fabrics, tailoring, and complete seasonal collections in person at Sonipat, Haryana.</p><div className="store-atelier-actions"><a href="tel:+918307949189">☎ &nbsp; Call Atelier</a><a href="https://www.instagram.com/vipulkumar_3254/" target="_blank" rel="noreferrer">◎ &nbsp; Instagram</a></div><div className="store-atelier-hours"><span>🟢 &nbsp; Mon - Sat: 10AM - 8:30PM</span><a href="mailto:vipulkumar3254@gmail.com">Support Email</a></div></section>

    <section className="store-newsletter"><div><span>✳ &nbsp; THE KUMAR EDIT</span><h2>Receive drops, offers and style notes</h2><p>A little inspiration, straight to your inbox.</p></div><form onSubmit={(e)=>{e.preventDefault();alert("Thanks for your interest. Newsletter signup will be connected soon.");}}><input type="email" required placeholder="Enter your email" aria-label="Email address"/><button type="submit">Subscribe</button></form></section>
  </main>;
}
