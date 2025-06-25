import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig";
import "../../css/userOrder.css";
import { Toaster,toast } from "react-hot-toast";

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
        const orderRef = orderData.docRef; // Firestore document reference to order
        const orderSnap = await getDoc(orderRef);
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

  const returnOrder = async (orderId) => {
    if (!user) return;

    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: "Return Requested",
      });

      toast.success("Return Request is raised, we will contact you shortly.",{duration:4000})

      
    } catch (error) {
      console.error("Error requesting return:", error);
      toast.error("Can't create return request at the moment,please try after some time.",{duration:4000})
    }
  };

  return (
    <div className="container my-4" style={{ minHeight: "500px" }}>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "300px" }}
        >
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : orders.length > 0 ? (
        <div className="row">
          {orders.map((item) => (
            <div className="col-12 col-md-6 col-lg-3 mb-3" key={item.orderId}>
              <div className="card shadow-sm h-100">
                {/* Image Section */}
                <div
                  className="text-center  p-3"
                  style={{ background: "#f8f6f9" }}
                >
                  <img
                    src={item.photo}
                    alt="cart item"
                    className="img-fluid rounded mx-auto"
                    style={{ maxHeight: "150px", objectFit: "contain" }}
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
                  <p
                    className={`mb-1 ${
                      item.status === "Order Cancelled"
                        ? "text-danger"
                        : "text-success"
                    }`}
                  >
                    <strong>Status:</strong> {item.status}
                      <p className="text-secondary mt-2">{ item.status =="Return Requested"?" We will contact you soon.": ""  }</p>
                  </p>
                  <p className="fw-bold text-primary">
                    <sup>&#x20B9;</sup> {item.price}
                  </p>
                </div>

                {/* Action Buttons */}
                {item.status !== "Order Cancelled" && item.status !== "Return Complete" && 
                  item.status !== "Order Complete" &&  item.status !== "Return Requested" && (
                    <div className="card-footer bg-white text-center">
                      <button
                        className="btn btn-danger w-100"
                        onClick={() => cancelOrder(item.orderId)}
                      >
                        Cancel Order
                      </button>
                    </div>
                  )}

                {item.status === "Order Complete" && (
                  <div className="card-footer bg-white text-center">
                    <button
                      className="btn btn-warning w-100"
                      onClick={() => returnOrder(item.orderId)}
                    >
                      Return Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className="d-flex flex-column justify-content-center align-items-center"
          style={{ height: "300px" }}
        >
          <p className="fs-5 text-muted">You haven’t placed any orders yet.</p>
          <button
            className="btn btn-primary"
            onClick={() => (window.location.href = "/")}
          >
            Browse Products
          </button>
        </div>
      )}

      <div style={{ marginTop: "200px" }}>
        <div>
          <h1 className="text-center">Important Information</h1>
        </div>
        <div className="mt-4 text-center">
          <p>If you need any help with your order, our support team is here for you.</p>
          <p>
            Contact us at{" "}
            <a href="mailto:vipulkumar3254@gmail.com">vipulkumar3254@gmail.com</a>{" "}
            or call +918307949189.
          </p>
          <p>
            We’re happy to assist with order status, cancellations, or any other
            queries.
          </p>
        </div>
      </div>
              <Toaster position="bottom-left" />
      
    </div>
  );
}

export default UserOrders;
