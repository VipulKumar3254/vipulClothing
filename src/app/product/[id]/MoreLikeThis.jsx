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

<<<<<<< HEAD
const styledTogether = [
  { id: "featured-olive-joggers", title: "Olive Modular Joggers", price: 499, tag: "BOTTOMWEAR", href: "/joggers-for-men", photo: "/stitch-assets/hd/desktop/summer-vibes.jpg" },
  { id: "featured-raw-indigo", title: "Raw Indigo Selvedge", price: 1299, tag: "OUTERWEAR", href: "/jeans-for-men", photo: "/stitch-assets/hd/desktop/category-jeans.jpg" },
];

=======
>>>>>>> origin/master
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
<<<<<<< HEAD
        if (!product?.price || !product?.category) { setLoading(false); return; }
=======
      if (!product?.price || !product?.category) return;
>>>>>>> origin/master

      try {
        const minPrice = product.price * 0.8;
        const maxPrice = product.price * 1.2;

        const q = query(
          collection(db, "products"),
<<<<<<< HEAD
          where("category", "array-contains", Array.isArray(product.category) ? product.category[0] : product.category),
=======
          where("category", "==", product.category),
>>>>>>> origin/master
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

<<<<<<< HEAD
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
=======
  if (loading) {
    return (
      <div style={{ minHeight: "400px" }} className="mt-5 p-2">
        <h4 style={{ fontFamily: "Jost Variable" }} className="mb-3">More Like This</h4>
        <div className="d-flex overflow-auto pb-2">
          {[...Array(4)].map((_, idx) => (
            <div key={idx} className="me-3">
              <div className="skeleton skeleton-card"></div>
              <div className="skeleton skeleton-title"></div>
              <div className="skeleton skeleton-price"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "400px" }} className="mt-5 px-1">
      <h4 style={{ fontFamily: "Jost Variable" }} className="mb-3">More Like This</h4>
      {related.length > 0 ? (
        <div className="d-flex overflow-auto pb-2">
          {related.map((item) => (
            
<Link href={`/product/${item.id}`} className="text-decoration-none text-dark">
  <div className="card me-3 shadow-sm border-0" key={item.id}>
    <div style={{ height: "350px", overflow: "hidden", borderRadius: "8px" }}>
      <img
        src={item.photo}
        className="img-fluid w-100 h-100"
        alt={item.title}
        style={{ objectFit: "cover", borderRadius: "8px" }}
      />
    </div>
    <div className="card-body p-2">
      <h6
        style={{ fontFamily: "Jost Variable", fontSize: "0.9rem" }}
        className="card-title mb-1 fw-normal"
      >
        {item.title}
      </h6>
      <div className="mt-2">
        <p
          style={{ backgroundColor: "#FFCE12" }}
          className="d-inline px-3 py-1 border rounded-5 cursor-pointer"
          onClick={(e) => handleWishList(e, item)}
        >
          Add to Wishlist
        </p>
      </div>
      <p
        style={{ fontFamily: "Jost Variable", fontSize: "1.1rem" }}
        className="card-text fw-medium text-muted mb-0 mt-2 price"
      >
        ₹{item.price}
      </p>
    </div>
  </div>
</Link>
          ))}
        </div>
      ) : (
        <p style={{ fontFamily: "Jost Variable" }} className="text-center">
          No similar products found.
        </p>
      )}
      <Toaster position="bottom-left" />
    </div>
>>>>>>> origin/master
  );
};

export default MoreLikeThis;
