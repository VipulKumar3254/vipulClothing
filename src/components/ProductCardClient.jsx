"use client";

import { useRouter } from "next/navigation";
import { auth, db } from "@/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function ProductCardClient({ id, product }) {
  console.log(product);
  const router = useRouter();
  const [user, setUser] = useState(null);

  // --- Auth subscription
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (usr) => setUser(usr || null));
    return () => unsub();
  }, []);

  // ------ Wishlist -------
  const handleAddToWishlist = async (e, product) => {
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

      await setDoc(
        doc(db, `users/${user.uid}/wishList`, product.id),
        wishListItem
      );

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

  return (
    <div
      onClick={(e) => handleAddToWishlist(e, product)}
      className="mt-2 text-start"
    >
      <p
        style={{
          backgroundColor: "#FFCE12",
          fontSize: "11px",
        }}
        className="d-inline px-3 py-1 border rounded-5 cursor-pointer"
      >
        Add to Wishlist
      </p>
    </div>
  );
}
