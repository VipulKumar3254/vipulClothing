import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import "../../css/userOrder.css";

function UserOrders() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
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
      const ordersQuery = query(collection(db, `users/${user.uid}/orders`));
      const ordersSnapshot = await getDocs(ordersQuery);

      const ordersPromises = ordersSnapshot.docs.map(async (order) => {
        const orderData = order.data();
        const orderRef = orderData.docRef; // Assuming this is a reference
        const orderSnap = await getDoc(orderRef);
        console.log("time of the oreder is ",orderSnap.data());
        return { orderId: orderSnap.id, ...orderSnap.data() };
      });

      const tempOrders = await Promise.all(ordersPromises);
      tempOrders.sort((a, b) => b.date - a.date);
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

      alert("Order canceled successfully.");
      fetchOrders(user);
    } catch (error) {
      console.error("Error canceling order:", error);
      alert("Failed to cancel the order. Please try again.");
    }
  };

  return (
    <div className="container my-4" style={{ minHeight: "500px" }}>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : orders.length > 0 ? (
        <div className="row">
          {orders.map((item) => (
            <div className="col-12 col-md-6 col-lg-4 mb-3" key={item.orderId}>
              <div className="card shadow-sm h-100">
                {/* Image Section */}
                <div className="text-center p-3" style={{ background: "#f8f6f9" }}>
                  <img
                    src={item.photo}
                    alt="cart item"
                    className="img-fluid rounded"
                    style={{ maxHeight: "150px", objectFit: "cover" }}
                  />
                </div>

                {/* Order Details */}
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="mb-1">
                    <strong>Color:</strong> {item.color}
                  </p>
                  <p className="mb-1">
                    <strong>Size:</strong> {item.size}
                  </p>
                  <p className={`mb-1 ${item.status === "Order Cancelled" ? "text-danger" : "text-success"}`}>
                    <strong>Status:</strong> {item.status}
                  </p>
                  <p className="fw-bold text-primary">
                    <sup>&#x20B9;</sup> {item.price}
                  </p>
                </div>

                {/* Cancel Order Button */}
                {item.status !== "Order Cancelled" && (
                  <div className="card-footer bg-white text-center">
                    <button className="btn btn-danger w-100" onClick={() => cancelOrder(item.orderId)}>
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "300px" }}>
          <p className="fs-5 text-muted">You haven’t placed any orders yet.</p>
          <button className="btn btn-primary" onClick={() => window.location.href = "/shop"}>
            Browse Products
          </button>
        </div>
      )}
    </div>
  );
}

export default UserOrders;
