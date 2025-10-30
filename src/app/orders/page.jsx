"use client";
import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { Toaster, toast } from "react-hot-toast";
import "@fontsource-variable/jost";



function UserOrders() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        fetchOrders(user);
      } else {
        setUser(null);
        setOrders([]);
        setLoading(false);
      }
    });
  }, []);

  const fetchOrders = async (user) => {
    if (!user) return;
    setLoading(true);

    try {
      const ordersQuery = query(
      collection(db, `users/${user.uid}/orders`),
      orderBy("date", "desc")
    );
      const ordersSnapshot = await getDocs(ordersQuery);

      const ordersPromises = ordersSnapshot.docs.map(async (order) => {
        const orderData = order.data();
        const orderRef = orderData.docRef;
        const orderSnap = await getDoc(orderRef);
        return { orderId: orderSnap.id, ...orderSnap.data() };
      });

      const tempOrders = await Promise.all(ordersPromises);
      console.log(tempOrders);
      // tempOrders.sort((a, b) => b.date - a.date);
      setOrders(tempOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }

    setLoading(false);
  };

  const cancelOrder = async (orderId) => {
    if (!user) return;

    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: "Order Cancelled",
      });
      toast.success("Order canceled successfully.");
      fetchOrders(user);
    } catch (error) {
      console.error("Error canceling order:", error);
      toast.error("Failed to cancel the order.");
    }
  };

  const returnOrder = async (orderId) => {
    if (!user) return;

    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: "Return Requested",
      });

      toast.success("Return request is raised, we will contact you shortly.");
    } catch (error) {
      console.error("Error requesting return:", error);
      toast.error(
        "Can't create return request at the moment. Please try again later."
      );
    }
  };

  return (
    <>
      <div
        className={`container my-4 `}
        style={{ minHeight: "500px" , fontFamily:"Jost Variable" }}
      >
        <Toaster position="bottom-left" />

        {loading ? (
          <div className="row">
            {[...Array(4)].map((_, index) => (
              <div className="col-12 col-md-6 col-lg-3 mb-3" key={index}>
                <div className="card shadow-sm h-100 placeholder-glow">
                  <div
                    className="text-center p-3"
                    style={{ background: "#f8f6f9", height: "150px" }}
                  >
                    <div className="placeholder w-75 h-100 mx-auto rounded"></div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title placeholder col-6"></h5>
                    <p className="placeholder col-4 mb-2"></p>
                    <p className="placeholder col-3 mb-2"></p>
                    <p className="placeholder col-6 mb-2"></p>
                    <p className="placeholder col-5 mb-2"></p>
                  </div>
                  <div className="card-footer bg-white text-center">
                    <div className="btn placeholder col-8"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          orders.map((order, index) => (
            <div key={index} className="card mb-4 shadow-sm p-3">
              <h5 className="mb-3">
                Order ID:{" "}
                <span className="text-primary">{order.orderId}</span>
              </h5>

              <div>
                <strong>Status:</strong> {order.status}
              </div>
              <div>
                <strong>Payment Status:</strong> {order.paymentStatus}
              </div>

              <div className="mt-3">
                <div className="row">
                  {order.products.map((prod, idx) => (
                    <div key={idx} className="col-md-4 col-sm-6 mb-3">
                      <div className="border rounded p-2 h-100 d-flex">
                        <img
                          src={prod.photo[0]}
                          alt={prod.title}
                          className="img-fluid mb-2"
                          style={{
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                        <div className="ms-3">
                          <strong>{prod.title}</strong>
                          <div>Size: {prod.size}</div>
                          <div>₹{prod.price}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-2">
                <strong>Subtotal:</strong> ₹{order.subtotal}
                <br />
                <strong>Shipping:</strong> ₹{order.shipping}
                <br />
                <strong>Discount:</strong> ₹{order.discount}
                <br />
                <strong>Total Amount:</strong>{" "}
                <span className="text-success fw-bold">
                  ₹{order.totalAmount}
                </span>
              </div>

              <div className="mt-2 text-muted">
                <small>
                  Ordered At:{" "}
                  {new Date(order.createdAt.seconds * 1000).toLocaleString()}
                </small>
              </div>
            </div>
          ))
        )}
      </div>

      <div style={{ marginTop: "200px" }}>
        <div>
          <h1 className="text-center">Important Information</h1>
        </div>
        <div className="mt-4 text-center">
          <p>
            If you need any help with your order, our support team is here for
            you.
          </p>
          <p>
            Contact us at{" "}
            <a href="mailto:vipulkumar3254@gmail.com">
              vipulkumar3254@gmail.com
            </a>{" "}
            or call +918307949189.
          </p>
          <p>
            We’re happy to assist with order status, cancellations, or any other
            queries.
          </p>
        </div>
      </div>
    </>
  );
}

export default UserOrders;
