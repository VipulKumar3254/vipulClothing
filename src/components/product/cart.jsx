import React, { useEffect, useState } from "react";
import "../../css/cart.css";

function Cart({ toggleCart }) {
 const [cart,setCart]=useState([]);

  useEffect(()=>{
    let cart = JSON.parse(localStorage.getItem("cart"))
    setCart(cart);

  },cart)
  return (
    <div id="header" className="d-flex flex-column h-100">
      
      <div className="cart-header">
        <h4>Your Cart</h4>
        <button className="close-button" onClick={toggleCart}>
          &times;
        </button>
      </div>
      <div id="mainContent" className="cart-content flex-grow-1 overflow-auto ">
        {/* Your cart items go here */}
        { cart?
          cart.map((item)=>{
            return (
              <div className=" m-1 d-flex ">
                <div className=""  ><img src={item.photo} style={{height:"200px", width:"200px"}} alt="cart item photo" /></div>
                <div className="ms-2 ">

                <div className="fs-5 fw-medium">
                {item.title}
                </div>
                <div className="fs-6">
                 <p className=" m-0" style={{fontSize:"12px"}}> <span className="fw-medium"> Color:</span> {item.color}</p>
                  <p className=" m-0" style={{fontSize:"12px"}}><span className="fw-medium"> Size:</span>{item.size}</p>
                  <p className="text-success m-0 " style={{fontSize:"12px"}}>In Stock</p>
                  <p className="fs-6 fw-bold"><sup>&#x20B9;</sup>{item.price}</p>
                </div>
              </div>
             
                </div>
              
            )
          })
        :""

        }
      </div>
      <div id="navfooter" className="d-flex p-3 bg-dark align-items-center position-sticky">
  <p className="text-secondary fw-medium fs-4 mb-0">Your Total is <span className="fw-bold text-light" > <sup>&#x20B9;</sup>2300</span></p>
  <button className="btn btn-primary fs-6 fw-bold ms-3">Proceed to Checkout</button>
</div>
    </div>
   
  );
}

export default Cart;
