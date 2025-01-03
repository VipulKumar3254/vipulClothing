import React from "react";
import "../../css/cart.css";

function Cart({ toggleCart }) {
  return (
    <div className="">
      
      <div className="cart-header">
        <h4>Your Cart</h4>
        <button className="close-button" onClick={toggleCart}>
          &times;
        </button>
      </div>
      <div className="cart-content">
        {/* Your cart items go here */}
        <p>Your cart is empty.</p>
      </div>
    </div>
   
  );
}

export default Cart;
