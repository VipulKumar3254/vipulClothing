import { getAuth,onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { db } from '../../../../firebaseConfig';
import { collection, doc, getDoc, getDocs, onSnapshot, query, updateDoc } from 'firebase/firestore';


const Orders = () => {
    const [admin,setAdmin]= useState(false);
    const [orders,setOrders]= useState([]);
    useEffect(()=>{
        const auth= getAuth();
      onAuthStateChanged(auth,async (user)=>{
        const docRef = doc(db,"users",user.uid);
        const docSnap = await getDoc(docRef)
        if(docSnap.exists())
        {
        if(docSnap.data().isAdmin)
        {
            setAdmin(true); 
           
        }
        }
        else{
            console.log("no data found")
        }

      })
    },[])

   

    const setOrderStatus=async (id,msg)=>{
      console.log(id);
      const orderRef = doc(db,"orders",id);
      console.log(id);
      const orderSnap = await getDoc(orderRef)
      if(orderSnap.exists())
      { console.log(orderSnap.data());
        await updateDoc(orderRef,{status:msg})
        console.log("Order status updated successfully.");
      }
      else{ console.log("no data found")} 
      
    }
    useEffect(()=>{
      if(!admin) return;
      

      const orderCollectionRef = collection(db,"orders")
      const unsubscribe = onSnapshot(orderCollectionRef, (snapshot) => {
        const orderList = snapshot.docs.map((doc) => ({
          orderId: doc.id,
          ...doc.data(),
        }));
        console.log(orderList);
        setOrders(orderList)
  
        // Update the state with the new order list
        // setOrders(orderList);
      });
      return ()=>{
        unsubscribe();
      }

    },[admin])
    return (
        <div>
            
            <div style={{minHeight:"500px"}} className='d-flex flex-column'>
                {admin? 
                <div id="mainContent" className="cart-content flex-grow-1 overflow-auto ">
                {/* Your cart items go here */}
                { orders.length>0?
                  orders.map((order)=>{
                    console.log(order);
                    return (
                        
                      <div className=" m-1 d-flex ">
                        <div className=""  ><img src={order.photo} style={{height:"200px", width:"200px"}} alt="cart item photo" /></div>
                        <div className="ms-2 ">
        
                        
                        <div className="fs-6">
                          <p className='m-0 fs-4'> {order.title}</p>
                         <p className=" m-0" style={{fontSize:"12px"}}> <span className="fw-medium"> Color:</span> {order.color}</p>
                          <p className=" m-0" style={{fontSize:"12px"}}><span className="fw-medium"> Size:</span>{order.size}</p>
                          <p className="text-success m-0  fs-6" >Status: {order.status}</p>
                          <button className="btn btn-primary" onClick={()=>{setOrderStatus(order.orderId, "Reject")}}>Reject</button>
                          <button className="btn btn-primary ms-2" onClick={()=>{setOrderStatus(order.orderId, "Order Requested")}}>Requested</button>
                          <button className="btn btn-primary ms-2" onClick={()=>{setOrderStatus(order.orderId, "Order Accepted")}}>Accept</button>
                          <button className="btn btn-primary ms-2" onClick={()=>{setOrderStatus(order.orderId, "Order Processing")}}>Processing</button>
                          <button className="btn btn-primary ms-2" onClick={()=>{setOrderStatus(order.orderId, "Out For Delievery")}}>Our for Delievery</button>
                          <button className="btn btn-primary ms-2" onClick={()=>{setOrderStatus(order.orderId, "Order Complete")}}>Complete</button>
                          <p className="fs-6 fw-bold"><sup>&#x20B9;</sup>{order.price}</p>
                        </div>
                      </div>
                     
                        </div>
                      
                    )
                  })
                : <div className=" "> <p className="fs-5 text-center ">You got no orders</p></div>       
                }
              </div>
                :"be the admin first"}
            </div>
        </div>
    );
};

export default Orders;