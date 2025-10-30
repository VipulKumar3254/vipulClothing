"use client";

import { useRef, useState } from "react";
import { ShoppingCart } from "@mui/icons-material";
import Cart from "@/components/basic/cart";

export default function CartClient() {
  const [showCart, setShowCart] = useState(true);
  const cartReference = useRef();

  const toggleCart = () => {
    cartReference.current?.classList.toggle("slide-in");
  };

  return (
    <>
      <div className="icon-btn" onClick={toggleCart}>
        <ShoppingCart fontSize="medium" />
      </div>

      <div ref={cartReference} className="cart-container">
        {showCart && <Cart toggleCart={toggleCart} />}
      </div>
    </>
  );
}
