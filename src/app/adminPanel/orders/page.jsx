"use client";

import { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebaseConfig"; // adjust path as needed
import "@fontsource-variable/jost";
import { Toaster, toast } from "react-hot-toast";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/userOrder.css"; // adjust path
// import "@/app/css/customModal.css"; // if you have modal CSS

export default function AdminOrders() {
  const [admin, setAdmin] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");

  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().isAdmin) {
        setAdmin(true);
        fetchOrders();
      } else {
        console.log("No admin privileges");
        setLoading(false);
      }
    });
  }, []);

  const fetchOrders = () => {
    const orderCollectionRef = collection(db, "orders");
    const unsubscribe = onSnapshot(orderCollectionRef, (snapshot) => {
      const orderList = snapshot.docs.map((doc) => ({
        orderId: doc.id,
        ...doc.data(),
      }));
      orderList.sort((a, b) => b.date - a.date);
      setOrders(orderList);
      setLoading(false);
    });
    return () => unsubscribe();
  };

  const setOrderStatus = async (id, msg) => {
    try {
      await updateDoc(doc(db, "orders", id), { status: msg });
      toast.success(`Order status updated to: ${msg}`, { duration: 3000 });
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update order status");
    }
  };

  const fetchUserDetails = async (userId) => {
    setLoadingUser(true);
    try {
      const userDocRef = doc(db, "users", userId);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        setSelectedUser(userSnap.data());
      } else {
        toast.error("User not found");
      }
    } catch (err) {
      console.error("Error fetching user:", err);
      toast.error("Failed to fetch user details");
    }
    setLoadingUser(false);
    setShowUserModal(true);
  };

  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  return (
    <div
      className="container my-4"
      style={{ minHeight: "500px", fontFamily: "Jost Variable" }}
    >
      <Toaster position="bottom-left" />
      <h2 className="text-center mb-4">All Orders (Admin)</h2>

      {admin && !loading && (
        <div className="mb-4">
          <label className="form-label me-2 fw-bold">Filter by Status:</label>
          <select
            className="form-select w-auto d-inline-block"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="Reject">Reject</option>
            <option value="Order Requested">Requested</option>
            <option value="Order Accepted">Accepted</option>
            <option value="Order Processing">Processing</option>
            <option value="Out For Delivery">Out for Delivery</option>
            <option value="Order Complete">Complete</option>
            <option value="Return Requested">Return Requested</option>
            <option value="Return Complete">Return Complete</option>
          </select>
        </div>
      )}

      {admin ? (
        loading ? (
          <p className="text-center">Loading...</p>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order, index) => (
            <div key={index} className="card mb-4 shadow-sm p-3">
              <h5 className="mb-3">
                Order ID: <span className="text-primary">{order.orderId}</span>
              </h5>
              <div>
                <strong>Status:</strong> {order.status}
              </div>
              <div>
                <strong>Payment Status:</strong> {order.paymentStatus}
              </div>

              <div className="mt-3">
                <div className="row">
                  {order.products?.map((prod, idx) => (
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
                          <div>
                            <strong>{prod.title}</strong>
                          </div>
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
                  {order.createdAt?.seconds
                    ? new Date(order.createdAt.seconds * 1000).toLocaleString()
                    : "N/A"}
                </small>
              </div>

              <div className="mt-3 d-flex gap-2">
                <div className="dropdown">
                  <button
                    className="btn btn-outline-primary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    Update Status
                  </button>
                  <ul className="dropdown-menu">
                    {[
                      "Reject",
                      "Order Requested",
                      "Order Accepted",
                      "Order Processing",
                      "Out For Delivery",
                      "Order Complete",
                      "Return Requested",
                      "Return Complete",
                    ].map((status) => (
                      <li key={status}>
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            setOrderStatus(order.orderId, status)
                          }
                        >
                          {status}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  className="btn btn-info"
                  onClick={() => fetchUserDetails(order.userId)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No orders found.</p>
        )
      ) : (
        <p className="text-center text-danger mt-5">
          You must be an admin to view this page.
        </p>
      )}

      {showUserModal && (
        <div
          className="custom-modal-overlay"
          onClick={() => setShowUserModal(false)}
        >
          <div
            className="custom-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="custom-modal-header">
              <h5>User Details</h5>
              <button
                className="close-btn"
                onClick={() => setShowUserModal(false)}
              >
                ✖
              </button>
            </div>
            <div className="custom-modal-body">
              {loadingUser ? (
                <p>Loading user details...</p>
              ) : selectedUser ? (
                <>
                  <p>
                    <strong>Name:</strong> {selectedUser.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedUser.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedUser.phone}
                  </p>
                  <p>
                    <strong>Address:</strong> {selectedUser.address}
                  </p>
                </>
              ) : (
                <p>No user details available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
