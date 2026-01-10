"use client";
import "@fontsource-variable/jost";
import { useContext, useState, useEffect } from "react";
import { filterContext } from "@/components/context/context";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig"; // ONLY for wishlist (client auth)
import { useRouter } from "next/navigation";
import { toast, Toaster } from "react-hot-toast";
import "@/styles/productDisplay.css";

const PRODUCTS_PER_PAGE = 8;

export default function ProductDisplay({ category, searchTerm }) {
  const filter = useContext(filterContext);
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [lastCursor, setLastCursor] = useState(null);
  const [page, setPage] = useState(1);

  /* ---------------- AUTH ---------------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(getAuth(), (u) => setUser(u || null));
    return () => unsub();
  }, []);

  /* ---------------- FETCH ---------------- */
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line
  }, [category, filter, searchTerm]);

  const fetchProducts = async (cursor = null) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        category: category || "",
        limit: PRODUCTS_PER_PAGE,
        order: filter?.orderBy || "asc",
      });

      if (filter?.lessThan) params.set("lt", filter.lessThan);
      if (searchTerm) params.set("search", searchTerm);
      if (cursor) params.set("cursor", cursor);

      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();

      if (!res.ok) throw new Error("Fetch failed");

      setProducts(data.products);
      setLastCursor(data.lastCursor || null);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load products");
      setLoading(false);
    }
  };

  /* ---------------- WISHLIST ---------------- */
  const handleWishList = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (!user) throw new Error("LOGIN");

      await setDoc(
        doc(db, `users/${user.uid}/wishList`, product.id),
        {
          title: product.title,
          price: product.price,
          photo: product.photo,
          productId: product.id,
          userId: user.uid,
        }
      );

      toast.success("Added to wishlist");
    } catch {
      toast.error("Please login to add wishlist");
    }
  };

  /* ---------------- UI ---------------- */
  const goProduct = (id) => router.push(`/product/${id}`);

  return (
    <>
      {loading ? (
        <Skeleton />
      ) : (
        <div className="container mt-3 px-1">
          <div className="row g-0 g-md-4">
            {products.length ? (
              products.map((item) => (
                <div className="col-6 col-md-3" key={item.id}>
                  <button
                    onClick={() => goProduct(item.id)}
                    className="card h-100 border-0 rounded-0"
                    style={{ background: "#F7F7F7" }}
                  >
                    <img
                      src={Array.isArray(item.photo) ? item.photo[0] : item.photo}
                      className="card-img-top"
                      alt={item.title}
                    />

                    <div className="card-body px-1">
                      <h2 className="fs-6 text-start">{item.title}</h2>
                      <span className="badge bg-success">Free delivery</span>

                      <div className="mt-2">
                        <p
                          className="d-inline px-3 py-1 border rounded-5"
                          style={{ background: "#FFCE12", fontSize: "11px" }}
                          onClick={(e) => handleWishList(e, item)}
                        >
                          Add to Wishlist
                        </p>
                      </div>

                      <p className="fw-bold mt-2">₹{item.price}</p>
                    </div>
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center">No products found</div>
            )}
          </div>

          {/* Pagination */}
          {!searchTerm && (
            <div className="d-flex justify-content-center gap-3 mt-4">
              <button
                className="btn btn-outline-primary"
                disabled={!lastCursor}
                onClick={() => {
                  setPage((p) => p + 1);
                  fetchProducts(lastCursor);
                }}
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

/* ---------------- SKELETON ---------------- */
function Skeleton() {
  return (
    <div className="container mt-3">
      <div className="row g-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <div className="col-6 col-md-3" key={i}>
            <div className="card placeholder-card h-100"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
