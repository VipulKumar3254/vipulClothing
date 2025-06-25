import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { db } from '../../../../firebaseConfig';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const Orders = () => {
  const [admin, setAdmin] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().isAdmin) {
        setAdmin(true);
      } else {
        console.log('No admin privileges');
      }
    });
  }, []);

  // Update order status
  const setOrderStatus = async (id, msg) => {
    const orderRef = doc(db, 'orders', id);
    const orderSnap = await getDoc(orderRef);
    if (orderSnap.exists()) {
      await updateDoc(orderRef, { status: msg });
      console.log('Order status updated to:', msg);
    } else {
      console.log('Order not found');
    }
  };

  // Fetch orders in real-time
  useEffect(() => {
    if (!admin) return;

    const orderCollectionRef = collection(db, 'orders');
    const unsubscribe = onSnapshot(orderCollectionRef, (snapshot) => {
      const orderList = snapshot.docs.map((doc) => ({
        orderId: doc.id,
        ...doc.data(),
      }));
      setOrders(orderList);
      setLoading(false); // Stop spinner after data fetched
    });

    return () => unsubscribe();
  }, [admin]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 mt-5">Orders</h2>
      {admin ? (
        loading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : orders.length > 0 ? (
          <div className="row">
            {orders.map((order) => (
              <div className="col-md-6 col-lg-3 mb-4" key={order.orderId}>
                <div className="card h-100 shadow-sm">
                  <img
                    src={order.photo}
                    className="card-img-top"
                    style={{ height: '200px', objectFit: 'contain' }}
                    alt={order.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{order.title}</h5>
                    <p className="mb-1"><strong>Color:</strong> {order.color}</p>
                    <p className="mb-1"><strong>Size:</strong> {order.size}</p>
                    <p className="mb-1"><strong>Status:</strong> <span className="text-success">{order.status}</span></p>
                    <p className="fw-bold"><sup>&#8377;</sup>{order.price}</p>

                    {/* Status dropdown */}
                    <div className="dropdown mt-2">
                      <button
                        className="btn btn-outline-primary dropdown-toggle w-100"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        Update Status
                      </button>
                      <ul className="dropdown-menu w-100">
                        <li><button className="dropdown-item" onClick={() => setOrderStatus(order.orderId, 'Reject')}>Reject</button></li>
                        <li><button className="dropdown-item" onClick={() => setOrderStatus(order.orderId, 'Order Requested')}>Requested</button></li>
                        <li><button className="dropdown-item" onClick={() => setOrderStatus(order.orderId, 'Order Accepted')}>Accepted</button></li>
                        <li><button className="dropdown-item" onClick={() => setOrderStatus(order.orderId, 'Order Processing')}>Processing</button></li>
                        <li><button className="dropdown-item" onClick={() => setOrderStatus(order.orderId, 'Out For Delievery')}>Out for Delivery</button></li>
                        <li><button className="dropdown-item" onClick={() => setOrderStatus(order.orderId, 'Order Complete')}>Complete</button></li>
                        <li><button className="dropdown-item" onClick={() => setOrderStatus(order.orderId, 'Return Requested')}>Return Requested</button></li>
                        <li><button className="dropdown-item" onClick={() => setOrderStatus(order.orderId, 'Return Complete')}>Return Complete</button></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No orders found.</p>
        )
      ) : (
        ""
        // <p className="text-center text-danger">You must be an admin to view this page.</p>
      )}
    </div>
  );
};

export default Orders;
