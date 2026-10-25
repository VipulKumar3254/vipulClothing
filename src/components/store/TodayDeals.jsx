"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const desktopDeals = [
  { title: "Black Minimalist Tee", category: "T-SHIRT • DAILY ESSENTIAL", description: "100% Combed Heavy Cotton 220 GSM", price: 399, originalPrice: 799, badge: "50% OFF", image: "/stitch-assets/deals/black-minimalist-tee.jpg", href: "/tshirts-for-men" },
  { title: "Cocoa Knit Resort Polo", category: "POLOS • TEXTURED KNIT", description: "Breathable mercerized piqué knit", price: 699, originalPrice: 1199, badge: "BEST SELLER", image: "/stitch-assets/deals/cocoa-knit-polo.jpg", href: "/shirts-for-men" },
  { title: "Olive Utility Joggers", category: "JOGGERS • ACTIVE FLEECE", description: "Pre-shrunk terry fleece with stretch", price: 599, originalPrice: 999, badge: "DROP 01", image: "/stitch-assets/deals/olive-utility-joggers.jpg", href: "/joggers-for-men" },
  { title: "Raw Selvedge Denim Coat", category: "OUTERWEAR • DENIM", description: "13.5oz Rigid Cotton Denim", price: 1299, originalPrice: 2499, badge: "TRENDING", image: "/stitch-assets/deals/raw-selvedge-denim-coat.jpg", href: "/jackets" },
];
const mobileDeals = [
  { title: "Essential Oversized Tee", category: "T-SHIRT", price: 399, originalPrice: 799, badge: "50% OFF", image: "/stitch-assets/deals/mobile-essential-tee.jpg", href: "/tshirts-for-men" },
  { title: "Summer Relaxed Jogger", category: "JOGGERS", price: 499, originalPrice: 999, badge: "50% OFF", image: "/stitch-assets/deals/mobile-summer-jogger.jpg", href: "/joggers-for-men" },
  { title: "Resort Camp Collar Shirt", category: "SHIRTS", price: 599, originalPrice: 1199, badge: "SPECIAL", image: "/stitch-assets/deals/mobile-resort-shirt.jpg", href: "/shirts-for-men" },
  { title: "Denim Workwear Overshirt", category: "JACKETS", price: 899, originalPrice: 1499, badge: "HOT", image: "/stitch-assets/deals/mobile-denim-overshirt.jpg", href: "/jackets" },
];

function imageUrl(photo) { const first=Array.isArray(photo)?photo[0]:photo;return typeof first==="string"?first:first?.url||""; }
function Countdown({seconds}) { return <span className="today-deal-timer-digits">{[Math.floor(seconds/3600),Math.floor((seconds%3600)/60),seconds%60].map(v=>String(v).padStart(2,"0")).join(" : ")}</span>; }
function Card({deal,liveProduct,mobile=false}) {
  const href=liveProduct?`/product/${liveProduct.id}`:deal.href;
  const title=liveProduct?.title||deal.title;
  const price=liveProduct?.price??deal.price;
  const badgeClass=deal.badge==="50% OFF"?"is-sale":deal.badge==="BEST SELLER"?"is-bestseller":deal.badge==="TRENDING"?"is-trending":deal.badge==="SPECIAL"?"is-special":deal.badge==="HOT"?"is-hot":"is-drop";
  return <article className={`today-deal-card ${mobile?"today-deal-mobile-card":"today-deal-desktop-card"}`}>
    <div className="today-deal-image-wrap"><Link href={href} className="today-deal-image-link" aria-label={`View ${title}`}><img className="today-deal-image" src={imageUrl(liveProduct?.photo)||deal.image} alt={title} loading="lazy"/></Link><span className={`today-deal-badge ${badgeClass}`}>{deal.badge}</span><button className="today-deal-heart" type="button" aria-label={`Save ${title}`} onClick={()=>toast("Wishlist will be connected for these featured deals.")}><img src="/stitch-assets/deals/heart-outline.svg" alt=""/></button></div>
    <div className="today-deal-info"><Link href={href} className="today-deal-copy"><span className="today-deal-category">{deal.category}</span><h3>{title}</h3>{!mobile&&<p>{deal.description}</p>}</Link><div className="today-deal-bottom"><div className="today-deal-prices"><strong>₹{Number(price).toLocaleString("en-IN")}</strong><s>₹{Number(deal.originalPrice).toLocaleString("en-IN")}</s></div><div className="today-deal-mobile-prices"><b>₹{Number(price).toLocaleString("en-IN")}</b><s>₹{Number(deal.originalPrice).toLocaleString("en-IN")}</s></div><Link className="today-deal-add" href={href} aria-label={mobile?`Quick add ${title}`:`Choose ${title}`}><img src="/stitch-assets/deals/cart-plus.svg" alt=""/><span>ADD</span></Link><Link className="today-deal-quick-add" href={href} aria-label={`Quick add ${title}`}>+</Link></div></div>
  </article>;
}

export default function TodayDeals({deals=[]}) {
  const [seconds,setSeconds]=useState(8*3600+42*60+19);
  useEffect(()=>{const id=setInterval(()=>setSeconds(v=>v>0?v-1:8*3600+42*60+19),1000);return()=>clearInterval(id)},[]);
  return <>
    <div className="today-deals-heading"><div><div className="today-deals-kicker"><span>◷</span> LIMITED STOCK</div><h2>Today’s Deals</h2><p>Limited pieces at exclusive introductory prices.</p></div><div className="today-deals-heading-actions"><div className="today-deals-countdown"><span>◷ &nbsp; ENDS IN</span><Countdown seconds={seconds}/></div><Link href="/allDeals">See all deals ↗</Link></div><Link href="/allDeals" className="today-deals-mobile-link">See all ↗</Link></div>
    <div className="today-deals-grid">{desktopDeals.map(deal=><Card key={deal.title} deal={deal} liveProduct={deals.find(product=>product.title?.trim().toLowerCase()===deal.title.toLowerCase())}/>)}</div>
    <div className="today-deals-mobile-grid">{mobileDeals.map(deal=><Card key={deal.title} deal={deal} liveProduct={deals.find(product=>product.title?.trim().toLowerCase()===deal.title.toLowerCase())} mobile/>)}</div>
  </>;
}
