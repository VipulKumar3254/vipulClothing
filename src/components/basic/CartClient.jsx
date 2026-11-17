"use client";

<<<<<<< HEAD
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
=======
import { useRef, useState } from "react";
>>>>>>> origin/master
import { ShoppingCart } from "@mui/icons-material";
import Cart from "@/components/basic/cart";

export default function CartClient() {
  const [showCart, setShowCart] = useState(true);
  const cartReference = useRef();
<<<<<<< HEAD
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
=======
>>>>>>> origin/master

  const toggleCart = () => {
    cartReference.current?.classList.toggle("slide-in");
  };

  return (
    <>
      <div className="icon-btn" onClick={toggleCart}>
        <ShoppingCart fontSize="medium" />
      </div>

<<<<<<< HEAD
      {/* Rendered at the page root so the fixed drawer spans the full viewport height
          (the sticky header's backdrop-filter would otherwise become its containing block) */}
      {mounted &&
        createPortal(
          <div ref={cartReference} className="cart-container">
            {showCart && <Cart toggleCart={toggleCart} />}
          </div>,
          document.body
        )}
=======
      <div ref={cartReference} className="cart-container">
        {showCart && <Cart toggleCart={toggleCart} />}
      </div>
>>>>>>> origin/master
    </>
  );
}
