"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Spinner from "react-bootstrap/Spinner";
import "@fontsource-variable/jost";
import "bootstrap-icons/font/bootstrap-icons.css";

import { useRouter } from "next/navigation";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { db } from "@/firebaseConfig";

import Cart from "@/components/basic/cart";
import "@/styles/profile.css";

const tempProfileImg =
  "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(true);

  const cartReference = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUser(userSnap.data());
            setProfilePhotoUrl(userSnap.data().profilePhotoUrl || "");
          } else {
            console.error("User doc not found");
          }
        } catch (e) {
          console.error("Error fetching user:", e);
        }
      } else {
        setUser(null);
        router.push("/login");
      }
      setLoading(false);
    });

    return () => unsub();
  }, [router]);

  const logout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleCart = () => {
    if (cartReference.current) {
      cartReference.current.classList.toggle("slide-in");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ minHeight: "400px" }}>
        <p className="text-center fs-5">Please login to continue</p>
      </div>
    );
  }

  return (
    <div className="mb-5" style={{ fontFamily: "Jost Variable" }}>
      {/* Mobile profile image */}
      <div className="col-md-12 text-center d-md-none mt-1 bg-dark">
        <div className="profile-img-wrapper mx-auto">
          <div className="profile-ring-wrapper mx-auto py-2">
            <img
              className="profile-image"
              src={profilePhotoUrl || tempProfileImg}
              alt="profile"
            />
          </div>
        </div>
        <h4 className="text-white text-top m-0 fs-4 fw-normal">Hi, {user?.name ?? "there"}</h4>
      </div>

      <div className="container mt-3">
        <div className="row justify-content-center">
          {/* Orders */}
          <div className="col-lg-3 col-md-6 col-12 card-profile-section m-2 text-center">
            <div className="row align-items-center justify-content-start">
              <div className="col-2 text-center">
                <i className="bi bi-box-seam fs-4 fs-md-1"></i>
              </div>
              <Link
                href="/orders"
                className="col-10 text-decoration-none text-black fs-4 d-flex align-items-center justify-content-between"
              >
                <span>Orders</span>
                <i className="bi bi-chevron-right fs-6 d-md-none"></i>
              </Link>
            </div>
            <p className="d-none d-md-block">Track, return, or buy something else</p>
          </div>

          {/* Wishlist */}
          <div className="col-lg-3 col-md-6 col-12 card-profile-section m-2 text-center">
            <div className="row align-items-center justify-content-start">
              <div className="col-2 text-center">
                <i className="bi bi-heart fs-4 fs-md-1"></i>
              </div>
              <Link
                href="/wishList"
                className="col-10 text-decoration-none text-black fs-4 d-flex align-items-center justify-content-between"
              >
                <span>WishList</span>
                <i className="bi bi-chevron-right fs-6 d-md-none"></i>
              </Link>
            </div>
            <p className="d-none d-md-block">Save items for later for convenience</p>
          </div>

          {/* Contact */}
          <div className="col-lg-3 col-md-6 col-12 card-profile-section m-2 text-center">
            <div className="row align-items-center justify-content-start">
              <div className="col-2 text-center">
                <i className="bi bi-envelope fs-4 fs-md-1 d-md-none"></i>
              </div>
              <Link
                href="/contact"
                className="col-10 text-decoration-none text-black fs-4 d-flex align-items-center justify-content-between"
              >
                <span>Contact Us</span>
                <i className="bi bi-chevron-right fs-6 d-md-none"></i>
              </Link>
            </div>
            <p className="d-none d-md-block">Need help? Don&apos;t worry, we are here</p>
          </div>

          {/* Cart */}
          <div
            className="col-lg-3 col-md-6 col-12 card-profile-section m-2 text-center"
            onClick={toggleCart}
          >
            <div className="row align-items-center justify-content-start">
              <div className="col-2 text-center">
                <i className="bi bi-cart fs-4 fs-md-1"></i>
              </div>
              <span className="col-10 text-black fs-4 d-flex align-items-center justify-content-between">
                <span>Cart</span>
                <i className="bi bi-chevron-right fs-6 d-md-none"></i>
              </span>
            </div>
            <p className="d-none d-md-block">Come on! Order, we are waiting</p>
          </div>

          {/* Logout */}
          <div
            className="col-lg-3 col-md-6 col-12 card-profile-section m-2 text-center"
            onClick={logout}
            role="button"
          >
            <div className="row align-items-center justify-content-start">
              <div className="col-2 text-center">
                <i className="bi bi-box-arrow-right fs-4 fs-md-1"></i>
              </div>
              <span className="col-10 text-black fs-4 d-flex align-items-center justify-content-between">
                <span>Log Out</span>
                <i className="bi bi-chevron-right fs-6 d-md-none"></i>
              </span>
            </div>
            <p className="d-none d-md-block">See you soon, have a nice day</p>
          </div>
        </div>
      </div>

      {/* Slide-in cart */}
      <div ref={cartReference} className="cart-container">
        {showCart && <Cart toggleCart={toggleCart} />}
      </div>
    </div>
  );
}
