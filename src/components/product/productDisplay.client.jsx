"use client";
import "@fontsource-variable/jost";
import { useContext, useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  startAfter,
  endBefore,
  limit,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { filterContext } from "@/components/context/context"; // adjust if needed
import Spinner from "react-bootstrap/Spinner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
// import Image from "next/image"; // optional if you want optimization
import "@/styles/productDisplay.css";

const productsPerPage = 8;

export default function ProductDisplay({
  category,
  searchTerm ,
  categoryDesc, // passed from the page file
}) {
  const filter = useContext(filterContext);
  

  const router = useRouter();

  const [user, setUser] = useState(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [lastDoc, setLastDoc] = useState(null);
  const [firstDoc, setFirstDoc] = useState(null);
  const [prevDocs, setPrevDocs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  // --- Auth subscription
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (usr) => setUser(usr || null));
    return () => unsub();
  }, []);

  // --- Fetch products whenever filters / category / searchTerm change
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, category, searchTerm]);

  // ------ Query builders & fetchers ------

  const buildQuery = (startPoint = null, direction = "next") => {
    // If you're on a dedicated page for ₹200 products, you can still keep this route:
    const is200Route = category === "rs200Products";

    // If a search query is present, we'll skip this builder
    if (searchTerm) return null;

    let qBase = collection(db, "products");

    if (is200Route) {
      qBase = query(qBase, where("price", "<", 250));
    } else if (category) {
      qBase = query(qBase, where("category", "array-contains", category));
    }

    // price filters
    if (filter?.lessThan) {
      qBase = query(qBase, where("price", "<", filter.lessThan));
    }

    // order
    if (filter?.orderBy) {
      qBase = query(qBase, orderBy("price", filter.orderBy));
    } else {
      qBase = query(qBase, orderBy("price", "asc"));
    }

    // pagination
    if (startPoint) {
      qBase =
        direction === "next"
          ? query(qBase, startAfter(startPoint))
          : query(qBase, endBefore(startPoint));
    }

    qBase = query(qBase, limit(productsPerPage));
    return qBase;
  };

  const fetchProducts = async (startPoint = null, direction = "next") => {
    setLoading(true);

    // Handle search mode
    if (searchTerm) {
      console.log("wroking on search term");
      await searchProducts(searchTerm);
      return;
    }

    const q = buildQuery(startPoint, direction);
    if (!q) {
      setLoading(false);
      return;
    }

    const snapshot = await getDocs(q);
    const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    if (direction === "next") {
      if (startPoint) setPrevDocs((prev) => [...prev, startPoint]);
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "prev") {
      setPrevDocs((prev) => prev.slice(0, -1));
      setCurrentPage((prev) => Math.max(1, prev - 1));
    }

    setProducts(items);
    setFirstDoc(snapshot.docs[0] || null);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1] || null);
    setLoading(false);
  };

  const searchProducts = async (term) => {
    const map = new Map();
    const underMatch = term.match(/under\s+(\d+)/i);
    const aboveMatch = term.match(/above\s+(\d+)/i);
    const price = parseInt(underMatch?.[1] || aboveMatch?.[1]);
    const condition = underMatch ? "<=" : ">=";
    const filteredWords = term
      .replace(/under\s+\d+|above\s+\d+/gi, "")
      .split(/\s+/)
      .filter(Boolean);

    try {
      if (!isNaN(price) && filteredWords.length) {
        const snap = await getDocs(
          query(collection(db, "products"), where("price", condition, price))
        );
        snap.docs.forEach((doc) => {
          const data = doc.data();
          const title = data.title?.toLowerCase() || "";
          const tags = (data.tags || []).map((t) => t.toLowerCase());
          if (
            filteredWords.some((w) => title.includes(w) || tags.includes(w))
          ) {
          map.set(doc.id, { id: doc.id, ...data });
          }
        });
      } else {
        const snap = await getDocs(
          query(
            collection(db, "products"),
            where("title", ">=", term),
            where("title", "<=", term + "\uf8ff")
          )
        );
        snap.docs.forEach((doc) => map.set(doc.id, { id: doc.id, ...doc.data() }));

        const tagSearches = term.split(/\s+/).map((w) =>
          getDocs(
            query(collection(db, "products"), where("tags", "array-contains", w))
          )
        );
        const results = await Promise.all(tagSearches);
        results.forEach((snap) => {
          snap.docs.forEach((doc) => map.set(doc.id, { id: doc.id, ...doc.data() }));
        });

        const exact = await getDocs(
          query(collection(db, "products"), where("price", "==", parseInt(term)))
        );
        exact.docs.forEach((doc) => map.set(doc.id, { id: doc.id, ...doc.data() }));
      }

      setProducts(Array.from(map.values()));
      setCurrentPage(1);
      setLoading(false);
    } catch (err) {
      console.error("Search error", err);
      setLoading(false);
    }
  };

  // ------ Wishlist -------
  const handleWishList = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    const wishListItem = {
      title: product.title,
      price: product.price,
      photo: product.photo,
      productId: product.id,
      userId: user?.uid,
    };

    try {
      if (!user) {
        throw new Error("User not logged in");
      }

      await setDoc(doc(db, `users/${user.uid}/wishList`, product.id), wishListItem);

      toast.custom(
        (t) => (
          <div
            className="toaster bg-success text-white px-5 py-2 shadow-sm d-flex justify-content-between align-items-center"
            style={{ fontFamily: "Jost Variable", fontSize: "12px" }}
          >
            <span className="text-center">Added to WishList</span>
            <button
              className="btn btn-sm btn-light ms-3"
              onClick={() => toast.dismiss(t.id)}
              style={{ fontSize: "12px" }}
            >
              Close
            </button>
          </div>
        ),
        { duration: 5000 }
      );
    } catch (err) {
      console.error(err);

      const message =
        err.message === "User not logged in"
          ? "Please login to add items to wishlist"
          : "Something went wrong";

      toast.custom(
        (t) => (
          <div
            className="toaster bg-danger text-white px-5 py-2 shadow-sm d-flex justify-content-between align-items-center"
            style={{ fontFamily: "Jost Variable", fontSize: "12px" }}
          >
            <span>{message}</span>
            <button
              className="btn btn-sm btn-light ms-3"
              onClick={() => toast.dismiss(t.id)}
              style={{ fontSize: "12px" }}
            >
              Close
            </button>
          </div>
        ),
        { duration: 5000 }
      );
    }
  };

  // ------ UI ------

  const handleProductClick = (productId) => {
    console.log(productId)

    
    // Navigate to the product page
    router.push(`/product/${productId}`);
  }

  return (
    <>
      {/* In Next.js we moved SEO metadata to the page's `generateMetadata` */}
      <div
        className="mt-1 d-block d-md-none text-center"
        style={{ fontFamily: "Jost Variable" }}
      >
        <div
          className="btn btn-secondary px-3"
          onClick={() => filter?.setFilterShow?.(!filter?.filterShow)}
        >
          Filters
        </div>
      </div>

      {loading ? (
        <div className="container mt-3 px-1">
          <div className="row g-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div
                  className="card placeholder-card h-100 border-0 rounded-0"
                  style={{ backgroundColor: "#f0f0f0" }}
                >
                  <div className="placeholder-img w-100"></div>
                  <div className="card-body px-2 py-2">
                    <div className="placeholder-text mb-2"></div>
                    <div className="placeholder-text short"></div>
                    <div
                      className="placeholder-text short mt-2"
                      style={{ width: "40%" }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="container mt-3 px-1">
          <div className="row g-0 g-md-4">
          {products.length > 0 ? (
            products.map((item) => (
              <div className="col-6 col-md-3" key={item.id}>
                {/* NOTE: you had NavLink with state; in Next, just push the id in the path or as query */}
                <button
                  // href={`/product/${item.id}`}
                  onClick={()=>{handleProductClick(item.id)}}
                  className="card h-100 text-decoration-none rounded-0 border-0"
                  style={{ backgroundColor: "#F7F7F7" }}
                >
                  <div className="position-relative">
                    {/* You can use next/image; use <img> if you didn't configure remote host */}
                    <img
                      src={Array.isArray(item.photo) ? item.photo[0] : item.photo}
                      className="card-img-top"
                      alt={item.title}
                    />
                  </div>

                  <div
                    className="card-body mt-1 px-1 "
                    style={{ fontFamily: "Jost Variable" }}
                  >
                    <h2 className="card-title fw-normal text-dark text-start "   style={{ fontSize: "22px" }} >
                     {item.title}
                    </h2>
                    <p
                      className="card-text text-muted p-0 mb-0 text-start"
                      style={{ fontSize: "12px" }}
                    >
                      <span className="badge bg-success text-start">
                        Free delivery
                      </span>{" "}
                      on ₹599+
                    </p>
                    <div className="mt-2 text-start">
                      <p
                        style={{ backgroundColor: "#FFCE12", fontSize: "11px" }}
                        className="d-inline px-3 py-1 border rounded-5 cursor-pointer"
                        onClick={(e) => handleWishList(e, item)}
                      >
                        Add to Wishlist
                      </p>
                    </div>
                    <p className="fw-medium text-dark fs-6 mb-0 mt-2 ms-0 text-start">
                      Rs. {item.price}
                    </p>
                  </div>
                </button>
              </div>
            ))
          ) : (
            <div className="col-12 text-center fs-5">
              No products available.
            </div>
          )}
          </div>

          {/* Pagination */}
          {!searchTerm && (
            <div className="d-flex justify-content-center align-items-center gap-3 mt-4 mb-2">
              <button
                className="btn btn-outline-secondary"
                onClick={() =>
                  fetchProducts(prevDocs[prevDocs.length - 1], "prev")
                }
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <span>Page {currentPage}</span>
              <button
                className="btn btn-outline-primary"
                onClick={() => fetchProducts(lastDoc)}
                disabled={products.length < productsPerPage}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      <Toaster position="bottom-left" />
    </>
  );
}
