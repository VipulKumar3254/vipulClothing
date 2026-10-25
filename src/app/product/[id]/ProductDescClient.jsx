"use client";
import "@/styles/productDesc.css";
import { useEffect, useMemo, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

const fallbackColors = ["Cocoa Brown", "Ecru Sand", "Sage Olive", "Atelier Black"];
const colorValues = { "cocoa brown": "#694839", "ecru sand": "#d5c8ad", "sage olive": "#68734d", "atelier black": "#242522", black: "#242522", olive: "#68734d", "off white": "#eee9dd", white: "#f5f2ea", navy: "#26384d", blue: "#536e8d", brown: "#765846", beige: "#c9b89e" };
const fallbackSizes = ["S", "M", "L", "XL", "XXL"];
const loomMetrics = [["WEIGHT DENSITY", "260 GSM", "Loom combed piqué"], ["YARN QUALITY", "100% Cotton", "Zero synthetic core"], ["FINISH", "Mercerized", "Subtle luster drape"], ["HARDWARE", "River shell", "Mother-of-pearl"]];

function normalizeImages(photo) {
  const values = Array.isArray(photo) ? photo : photo ? [photo] : [];
  return values.map((item) => typeof item === "string" ? item : item?.url || item?.downloadURL || "").filter(Boolean);
}

export default function ProductDescClient({ product }) {
  const photos = useMemo(() => normalizeImages(product.photo), [product.photo]);
  const colors = Array.isArray(product.color) && product.color.length ? product.color : fallbackColors;
  const sizes = Array.isArray(product.sizes) && product.sizes.length ? product.sizes : fallbackSizes;
  const [purchase, setPurchase] = useState(() => ({ color: colors[0] || "Cocoa Brown", size: "", quantity: 1 }));
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(colors[0] || "Cocoa Brown");
  const [pinCode, setPinCode] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [openDetails, setOpenDetails] = useState("fabric");
  const [user, setUser] = useState(null);
  const router = useRouter();
  const price = Number(product.price) || 0;
  const originalPrice = Number(product.originalPrice || product.mrp || Math.round(price * 1.714));
  const discount = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 42;
  const formatPrice = (amount) => new Intl.NumberFormat("en-IN").format(Number(amount) || 0);

  useEffect(() => {
    const auth = getAuth();
    return onAuthStateChanged(auth, (usr) => setUser(usr || null));
  }, []);

  const purchaseSet = () => ({ ...purchase, title: product.title, price, photo: photos[0] || "", productId: product.id, userId: user?.uid });
  const validate = () => {
    if (!user) { toast.error("Please login to continue"); return false; }
    if (!purchase.size || !purchase.color) { toast.error("Please choose size and color"); return false; }
    return true;
  };
  const addToCart = async () => {
    if (!validate()) return;
    try {
      const item = purchaseSet();
      const ref = doc(db, `users/${user.uid}/cart`, product.id);
      const existing = await getDoc(ref);
      if (existing.exists() && existing.data().size === item.size && existing.data().color === item.color) {
        await setDoc(ref, { ...existing.data(), quantity: (Number(existing.data().quantity) || 1) + item.quantity });
      } else await setDoc(ref, item);
      toast.success("Added to bag");
    } catch (error) { console.error("Unable to add item to cart", error); toast.error("Could not add item to bag"); }
  };
  const buyNow = () => {
    if (!validate()) return;
    sessionStorage.setItem("buyNow", JSON.stringify(purchaseSet()));
    router.push("/checkout?mode=buy-now");
  };
  const saveWishlist = async () => {
    if (!user) { toast.error("Please login to save this item"); return; }
    try {
      await setDoc(doc(db, `users/${user.uid}/wishList`, product.id), { title: product.title, price, photo: photos[0] || "", productId: product.id, userId: user.uid });
      toast.success("Saved to wishlist");
    } catch (error) { console.error("Unable to save wishlist item", error); toast.error("Could not save this item"); }
  };
  const shareProduct = async () => {
    const url = window.location.href;
    if (navigator.share) { try { await navigator.share({ title: product.title, url }); } catch {} }
    else if (navigator.clipboard) { await navigator.clipboard.writeText(url); toast.success("Product link copied"); }
  };
  const checkDelivery = (event) => {
    event.preventDefault();
    setDeliveryMessage(pinCode.length === 6 ? "Sonipat Atelier dispatches within 24 hours. Estimated delivery: 2–4 days." : "Enter a valid 6-digit pincode.");
  };
  const setColor = (color, index) => {
    setSelectedColor(color);
    setPurchase((current) => ({ ...current, color }));
    if (index < photos.length) setSelectedImageIndex(index);
  };
  const productDescription = (Array.isArray(product.desc) && product.desc.length)
    ? product.desc.map((section) => `${section.title}: ${section.desc}`).join(" ")
    : product.subTitle || "Structured open-weave mercerized cotton with a tipped revere collar. Crafted for a breathable, easy resort silhouette.";

  return <>
    <div className="product-context-bar">
      <nav><Link href="/">HOME</Link><span>/</span><Link href="/shirts-for-men">MEN</Link><span>/</span><span>{product.category?.[0] || "POLOS & KNITS"}</span></nav>
      <div><span className="product-live-dot"/> ATELIER VERIFIED <span className="product-context-divider">·</span> COMPLIMENTARY SHIPPING OVER ₹999</div>
    </div>
    <div className="product-mobile-subnav">
      <button type="button" onClick={() => router.back()} aria-label="Go back">‹</button>
      <div><span>MEN</span><b> / </b><strong>{product.category?.[0] || "POLOS & KNITS"}</strong></div>
      <button type="button" onClick={shareProduct} aria-label="Share product">↗</button>
      <button type="button" onClick={saveWishlist} aria-label="Add to wishlist">♡</button>
    </div>

    <main className="store-product-detail">
      <div className="store-detail-gallery-column">
        <div className="store-detail-gallery">
          <div className="store-detail-main">
            {photos.length ? <img src={photos[Math.min(selectedImageIndex, photos.length - 1)]} alt={product.title || "Product"}/> : <div className="store-detail-no-image">KUMAR<br/>FASHION</div>}
            <div className="store-detail-ribbons"><span>HAND-LOOMED PIQUÉ</span><span>SAVE {discount}%</span></div>
            <div className="store-detail-watermark"><span>✳</span><div><b>ATELIER CERTIFIED</b><small>Haryana Craft Guild</small></div></div>
            <button type="button" className="store-detail-favorite" aria-label="Save to wishlist" onClick={saveWishlist}>♡</button>
          </div>
          <div className="store-detail-thumbs" aria-label="Product images">
            {(photos.length ? photos : [""]).slice(0,4).map((photo,index)=><button key={`${photo}-${index}`} type="button" aria-label={`Show product image ${index+1}`} className={selectedImageIndex===index?"active":""} onClick={()=>setSelectedImageIndex(index)}>{photo?<img src={photo} alt=""/>:<span>KUMAR</span>}<small>{["Flatlay","Editorial","Atelier","Weave"][index]}</small></button>)}
          </div>
        </div>
        <section className="store-loom-card">
          <div className="store-loom-heading"><h2>Artisanal Loom Specifications</h2><span>SPEC ID: KMR-PK-25</span></div>
          <div className="store-loom-grid">{loomMetrics.map(([label,value,detail])=><article key={label}><span>✳</span><small>{label}</small><b>{value}</b><p>{detail}</p></article>)}</div>
        </section>
      </div>

      <section className="store-detail-info">
        <div className="store-detail-kicker-row"><span>SUMMER ’25 RESORT CAPSULE</span><small><i/> Only 14 units remain</small></div>
        <h1>{product.title}</h1>
        <div className="store-detail-rating"><span>★★★★★</span><b>4.9</b><a href="#product-reviews">128 verified reviews</a><i>·</i><span>18 sold in 24h</span></div>
        <div className="store-detail-pricing-card"><div className="store-detail-price-row"><strong>₹{formatPrice(price)}</strong>{originalPrice>price&&<s>₹{formatPrice(originalPrice)}</s>}<span>SAVE ₹{formatPrice(Math.max(0,originalPrice-price))} ({discount}% OFF)</span></div><p>Inclusive of all taxes. Free express shipping applied automatically.</p><div className="store-detail-privilege"><b>✦</b><span><strong>ATELIER PRIVILEGE</strong><small>Unlock any Essential Supima Tee for just <b>₹250</b> at checkout!</small></span><i>↗</i></div></div>

        <div className="store-detail-option store-detail-color-option"><div className="store-detail-option-heading"><label>Colorway:</label><span>{selectedColor || colors[0]}</span><small>4 hand-dyed tones</small></div><div className="store-detail-swatches">{colors.slice(0,4).map((color,index)=><button key={`${color}-${index}`} type="button" aria-label={color} title={color} className={selectedColor===color?"active":""} style={{"--swatch-color":colorValues[color.toLowerCase()] || colorValues[color.toLowerCase().replace(/\s+.*/, "")] || "#c8c8c0"}} onClick={()=>setColor(color,index)}/>)}</div></div>
        <div className="store-detail-option store-detail-size-option"><div className="store-detail-option-heading"><label>Select size (chest inches):</label><button type="button" className="store-size-guide" onClick={()=>toast("Size & fit guide will be available soon.")}>⌑ &nbsp; SIZE &amp; FIT GUIDE</button></div><div className="store-detail-sizes">{sizes.slice(0,5).map((size,index)=><button type="button" key={`${size}-${index}`} className={purchase.size===size?"active":""} onClick={()=>setPurchase((current)=>({...current,size}))}><b>{size}</b><small>{["38 in","40 in","42 in","44 in","46 in"][index]}</small>{index===1&&<i>POPULAR</i>}{index===3&&<i>ONLY 2</i>}</button>)}</div><p className="store-fit-note">Model is 6’1” wearing size L for an easy resort silhouette.</p></div>
        <div className="store-detail-delivery"><div className="store-detail-delivery-heading"><b>⌖ &nbsp; CHECK DELIVERY &amp; COD AVAILABILITY</b><span>SONIPAT HUB</span></div><form onSubmit={checkDelivery}><input aria-label="Pincode" inputMode="numeric" maxLength={6} placeholder="Enter 6-digit Pincode" value={pinCode} onChange={(event)=>setPinCode(event.target.value.replace(/\D/g,""))}/><button type="submit">VERIFY</button></form>{deliveryMessage&&<small className="store-delivery-result">{deliveryMessage}</small>}<p>♧ &nbsp; Delivering to Delhi NCR in <b>24–48 hours</b>. Free shipping on this drop.</p></div>
        <div className="store-detail-actions"><div className="store-detail-quantity"><button type="button" aria-label="Decrease quantity" onClick={()=>setPurchase((current)=>({...current,quantity:Math.max(1,(current.quantity||1)-1)}))}>−</button><b>{purchase.quantity||1}</b><button type="button" aria-label="Increase quantity" onClick={()=>setPurchase((current)=>({...current,quantity:(current.quantity||1)+1}))}>+</button></div><button type="button" className="store-detail-add-button" onClick={addToCart}>♧ &nbsp; ADD TO BAG · ₹{formatPrice(price)}</button><button type="button" className="store-detail-save-button" onClick={saveWishlist} aria-label="Save to wishlist">♡</button></div>
        <button type="button" className="store-detail-buy-button" onClick={buyNow}>INSTANT ATELIER CHECKOUT (COD / UPI) &nbsp; ↗</button>
        <div className="store-detail-traits"><div><b>↺</b><span><strong>7-DAY FREE EXCHANGE</strong><small>Hassle-free doorstep swap</small></span></div><div><b>₹</b><span><strong>CASH ON DELIVERY</strong><small>Pay when delivered</small></span></div><div><b>✳</b><span><strong>100% GENUINE CRAFT</strong><small>Preshrunk loom guarantee</small></span></div><div><b>⌂</b><span><strong>DIRECT ATELIER PRICE</strong><small>Zero retail middleman cut</small></span></div></div>
        <div className="store-detail-accordions">{[["fabric","Fabric, Loom & Craft Details"],["measure","Measurement Matrix (Inches)"],["origin","7-Day Doorstep Exchange & Origin"]].map(([key,label])=><div key={key}><button type="button" aria-expanded={openDetails===key} onClick={()=>setOpenDetails(openDetails===key?"":key)}>{label}<span>{openDetails===key?"⌃":"⌄"}</span></button>{openDetails===key&&<p>{key==="fabric"?productDescription:key==="measure"?"Size S: 38 in · M: 40 in · L: 42 in · XL: 44 in · XXL: 46 in. Measurements are garment chest circumference.":"Made with care at the Kumar Fashion atelier in Sonipat. Includes a 7-day doorstep exchange for eligible items."}</p>}</div>)}</div>
      </section>
    </main>
  </>;
}
