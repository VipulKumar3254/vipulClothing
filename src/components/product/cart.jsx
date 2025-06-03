import React, { useEffect, useState } from "react";
import "../../css/cart.css";
import { Accordion, CardGroup } from "react-bootstrap";
import { addDoc, collection, deleteDoc, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { getAuth,onAuthStateChanged } from "firebase/auth";
import { Toaster, toast } from 'react-hot-toast';


function Cart({ toggleCart }) {
  
 const [cart,setCart]=useState([]);
 const [totalPrice,setTotalPrice]= useState(0);
 const [user,setUser]= useState({});
 

//  setting the user
  useEffect(()=>{
    const auth = getAuth();
    onAuthStateChanged(auth,(user)=>{
      if(user){
        
        setUser(user)
        console.log("user set",user);
      }
      else{
        setUser(null)
        console.log("user not logged in ");
      }
    })
  },[])

 
  // setting the cart on firebase server.
  useEffect(()=>{
   if(user)
   {

     // still need to implement feature of adding unique cartItem to inserted on server
     const cartCollectionRef = collection(db,`users/${user.uid}/cart`)
    const unsubscribe = onSnapshot(cartCollectionRef, (snapshot) => {
      const cartList = snapshot.docs.map((doc) => ({
        orderId: doc.id,
        ...doc.data(),
      }));
      console.log( "cart is ",cartList);
      setCart(cartList)
      let total = cartList.reduce((acc,item)=>{
      return acc+ parseInt(item.price,10);
    },0)
    console.log(total);
    setTotalPrice(total)
    });



    return ()=>{
      unsubscribe();
    }
  }

  },[user])


   // setting the cart on localstorage
   useEffect(()=>{
    // let cart = localStorage.getItem("cart")
    // if(!cart) { return;}
    // cart = JSON.parse(cart)
    // console.log(cart);
    // setCart(cart);
  
     
  },[])


  // removing the product from cart
  const removeProduct = async (id)=>{
    try{
      console.log(id);
      const cartRef = doc(db,`users/${user.uid}/cart`,id)
      let result = await deleteDoc(cartRef)
          toast.success('Product Removed from Cart', { duration: 4000 });

    }catch(err){
      console.log(err);
          toast.error('Product Removed from Cart', { duration: 4000 });

    }
  }

  const handleCheckout =async  ()=>{
    try{
      const userRef = doc(db,"users",user.uid)
      console.log("hii",cart);
      cart.map(async(item)=>{
        delete item.orderId
        console.log("actual order sent from cart to  db is",item);
        
      const docRef = await addDoc(collection(db,"orders"),{...item,user:userRef,status:"Order Requested",date:new Date()} )
      await addDoc(collection(db,`users/${user.uid}/orders`),{docRef})
      console.log("and the id of the doc sent to global order is ",docRef.id);
     const cartCollectionRef = collection(db,`users/${user.uid}/cart`)
        await deleteDoc(doc(cartCollectionRef,item.orderId))

      })
      alert("Purchase successful")
    }catch(err){
      console.log(err);
    }
    } 
   
  
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
        { cart.length>0?
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
                  <p className="fs-6 fw-bold m-0"><sup>&#x20B9;</sup>{item.price}</p>
                  <button className="btn btn-primary " onClick={ ()=>{removeProduct(item.orderId)}} >Remove</button>
                </div>
              </div>
             
                </div>
              
            )
          })
        : <div className=" "> <p className="fs-5 text-center ">Your Cart is Empty</p></div>       
        }
      </div>
      {
        totalPrice>0?
            <div id="navfooter" className="d-flex p-3 bg-dark align-items-center position-sticky">
        <p className="text-secondary fw-medium fs-4 mb-0">Your Total is <span className="fw-bold text-light" > <sup>&#x20B9;</sup>{totalPrice}</span></p>
        <button className="btn btn-primary fs-6 fw-bold ms-3" onClick={handleCheckout}>Proceed to Checkout</button>
      </div>
    :""}
        <Toaster position="bottom-right" />

    </div>
   
  );
}

export default Cart;
