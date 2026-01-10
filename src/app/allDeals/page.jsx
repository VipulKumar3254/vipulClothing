"use client";

import "@fontsource-variable/jost";
import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { collection, getDocs, query, where, doc, setDoc } from "firebase/firestore";
import Link from "next/link";
import "@/styles/productDisplay.module.css";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";

export default function AllDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Track logged-in user
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (usr) => setUser(usr || null));
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const q = query(collection(db, "products"), where("isDeal", "==", true));
        const querySnapshot = await getDocs(q);
        const dealsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDeals(dealsArray);
      } catch (error) {
        console.error("Error fetching deals: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, []);

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
      if (!user) throw new Error("User not logged in");

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
        { duration: 4000 }
      );
    } catch (err) {
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
        { duration: 4000 }
      );
    }
  };

  return (
    <div className="container mt-3 px-1" style={{ fontFamily: "Jost Variable" }}>
      <h2 className="text-center mb-4 fw-normal fs-2">🔥 Hot Deals 🔥</h2>

      {loading ? (
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
      ) : deals.length === 0 ? (
        <p className="text-center fs-5">No deals available right now.</p>
      ) : (
        <div className="row g-0 g-md-4">
          {deals.map((item) => (
            <div className="col-6 col-md-3" key={item.id}>
              <Link
                href={`/product/${item.id}`}
                className="card h-100 text-decoration-none rounded-0 border-0"
                style={{ backgroundColor: "#F7F7F7" }}
              >
                <div className="position-relative">
                  <Image
                    src={Array.isArray(item.photo) ? item.photo[0] : item.photo}
                    alt={item.title}
                    className="card-img-top"
                  />
                </div>

                <div className="card-body mt-1 px-1">
                  <h5 className="card-title fw-normal text-dark">{item.title}</h5>
                  <p
                    className="card-text text-muted p-0 mb-0"
                    style={{ fontSize: "12px" }}
                  >
                    <span className="badge bg-success text-start">Free delivery</span>{" "}
                    on ₹599+
                  </p>
                  <div className="mt-2">
                    <p
                      style={{ backgroundColor: "#FFCE12", fontSize: "11px" }}
                      className="d-inline px-3 py-1 border rounded-5 cursor-pointer"
                      onClick={(e) => handleWishList(e, item)}
                    >
                      Add to Wishlist
                    </p>
                  </div>
                  <p className="fw-medium text-dark fs-6 mb-0 mt-2 ms-0">
                    Rs. {item.price}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}

      <Toaster position="bottom-left" />
    </div>
  );
}
