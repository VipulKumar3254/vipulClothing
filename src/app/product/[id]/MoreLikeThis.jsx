"use client";
import Link from "next/link"; // At top if not already
import "@fontsource-variable/jost";
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
// import { db } from "../../../../firebaseConfig";
import { db } from "@/firebaseConfig";
// import "../../../css/MoreLikeThis.css";
import "@/styles/moreLikeThis.css"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";

const styledTogether = [
  { id: "featured-olive-joggers", title: "Olive Modular Joggers", price: 499, tag: "BOTTOMWEAR", href: "/joggers-for-men", photo: "/stitch-assets/desktop/2cf81c12-bbe7-41be-a0d0-bbf76d33f422.jpg" },
  { id: "featured-raw-indigo", title: "Raw Indigo Selvedge", price: 1299, tag: "OUTERWEAR", href: "/jeans-for-men", photo: "/stitch-assets/desktop/2c7b986d-9e2b-4335-b416-fc497db2697f.jpg" },
];

const MoreLikeThis = ({ product }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Track user authentication
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user || null);
    });
    return () => unsubscribe();
  }, []);

  // Fetch related products
  useEffect(() => {
    const fetchRelated = async () => {
        if (!product?.price || !product?.category) { setLoading(false); return; }

      try {
        const minPrice = product.price * 0.8;
        const maxPrice = product.price * 1.2;

        const q = query(
          collection(db, "products"),
          where("category", "array-contains", Array.isArray(product.category) ? product.category[0] : product.category),
          where("price", ">=", minPrice),
          where("price", "<=", maxPrice)
        );

        const snapshot = await getDocs(q);
        const results = snapshot.docs
          .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
          .filter((p) => p.id !== product.id);

        setRelated(results);
      } catch (err) {
        console.error("Error fetching related products:", err);
      }
      setLoading(false);
    };

    fetchRelated();
  }, [product]);

  // Handle wishlist action
  const handleWishList = async (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error("Please login to add items to wishlist", { duration: 3000 });
      return;
    }

    try {
      const wishListItem = {
        title: item.title,
        price: item.price,
        photo: item.photo,
        productId: item.id,
        userId: user.uid,
      };

      await setDoc(doc(db, `users/${user.uid}/wishList`, item.id), wishListItem);

      toast.success("Added to Wishlist", { duration: 3000 });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong", { duration: 3000 });
    }
  };

  const suggestions = related.length >= 2 ? related.slice(0, 4).map((item) => ({ ...item, href: `/product/${item.id}`, tag: Array.isArray(item.category) ? item.category[0] : item.category })) : styledTogether;
  return (
    <section className="store-pairings">
      <div className="store-pairings-heading"><div><span>ATELIER WARDROBE</span><h2>Pairs Impeccably With</h2></div><small>Styled together ↗</small></div>
      <div className="store-pairings-grid">
        {suggestions.map((item, index) => {
          const image = Array.isArray(item.photo) ? item.photo[0] : item.photo;
          return <Link href={item.href} key={item.id} className="store-pairing-card"><div className="store-pairing-image"><img src={image || styledTogether[index % styledTogether.length].photo} alt={item.title}/><button type="button" aria-label={`Quick add ${item.title}`} onClick={(event)=>{event.preventDefault();toast("Choose a size on the product page to add this item.")}}>+</button></div><span>{item.tag || "ESSENTIAL"}</span><h3>{item.title}</h3><strong>₹{new Intl.NumberFormat("en-IN").format(Number(item.price)||0)}</strong></Link>;
        })}
      </div>
      <Toaster position="bottom-left" />
    </section>
  );
};

export default MoreLikeThis;
