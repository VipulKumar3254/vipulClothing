"use client";
import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { db } from "@/firebaseConfig";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "@/styles/productDisplay.css"; // using same style as ProductDisplay

const WishList = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [user, setUser] = useState(null);
  const router = useRouter();

  const handleClick = (productId) => {
    router.push(`/product/${productId}`);
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (usr) => setUser(usr || null));
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const wishlistRef = collection(db, `users/${user.uid}/wishList`);
        const wishlistSnap = await getDocs(wishlistRef);

        const items = wishlistSnap.docs.map((doc) => ({
          productId: doc.id,
          ...doc.data(),
        }));

        setWishlistItems(items);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    if (user && user.uid) fetchWishlist();
  }, [user]);

  const handleRemoveFromWishlist = async (productId) => {
    const toastId = toast.loading("Removing from wishlist...");

    try {
      const itemRef = doc(db, `users/${user.uid}/wishList`, productId);
      await deleteDoc(itemRef);

      setWishlistItems((prevItems) =>
        prevItems.filter((item) => item.productId !== productId)
      );
      toast.success("Removed successfully!", { id: toastId });
    } catch (error) {
      toast.error("Failed to remove item.", { id: toastId });
      console.error("Error removing item from wishlist:", error);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center" style={{ fontFamily: "Jost Variable" }}>
        Your Wishlist
      </h2>

      <div className="row g-0 g-md-4">
        {wishlistItems.length > 0 ? (
          wishlistItems.map((item) => (
            <div
              onClick={() => handleClick(item.productId)}
              className="col-6 col-md-3"
              key={item.productId}
            >
              <div
                className="card h-100 text-decoration-none rounded-0 border-0 wishlist-card"
                style={{ backgroundColor: "#F7F7F7", cursor: "pointer" }}
              >
                <div className="position-relative">
                  <Image
                    src={Array.isArray(item.photo) ? item.photo[0] : item.photo}
                    alt={item.title}
                    className="card-img-top"
                    width={300}
                    height={300}
                    style={{
                      objectFit: "cover",
                      height: "450px", // same as ProductDisplay.jsx
                      width: "100%",
                    }}
                  />
                </div>

                <div
                  className="card-body mt-1 px-1"
                  style={{ fontFamily: "Jost Variable" }}
                >
                  <h5
                    className="card-title fw-normal text-dark mb-1"
                    style={{
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      fontSize: "1rem",
                    }}
                  >
                    {item.title}
                  </h5>

                  <p className="fw-medium text-dark fs-6 mb-2">
                    ₹ {item.price}
                  </p>

                  {/* Remove badge */}
                  <p
                    className="d-inline px-3 py-1 border rounded-5 remove-badge"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromWishlist(item.productId);
                    }}
                  >
                    Remove
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center fs-5">
            No items in your wishlist.
          </div>
        )}
      </div>

      <Toaster position="bottom-left" />

      <style jsx>{`
        .wishlist-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .wishlist-card:hover {
          transform: translateY(-5px);
          box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
        }
        .remove-badge {
          background-color: #ffce12;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .remove-badge:hover {
          background-color: #ff4747;
          color: white;
        }
      `}</style>
    </div>
  );
};

export default WishList;
