import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useLocation } from "react-router-dom";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../../../firebaseConfig';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../../../firebaseConfig';

import {
  collection,
  getDocs,
  doc,
  addDoc,
  serverTimestamp,
  deleteDoc
} from 'firebase/firestore';
import { useAccordionButton } from 'react-bootstrap';




const Checkout = () => {
  const functions = getFunctions(app);
  const [user, setUser] = useState({});
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [shipping, setShipping] = useState(0);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    phone: '',
    street: '',
    pincode: '',
    state: '',
    city: '',
    notes: '',
    coupon: '',
  });

  const eraseCart = async () => {
    try {
      const cartCollectionRef = collection(db, `users/${user.uid}/cart`);
      const querySnapshot = await getDocs(cartCollectionRef);

      const deletePromises = querySnapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, `users/${user.uid}/cart`, docSnap.id))
      );

      await Promise.all(deletePromises);

    } catch (err) {
      console.error(err);
    }
  };

  //  setting the user
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {

        setUser(user)
        const username = httpsCallable(functions, "userName")
        const result = await username();
        console.log(result);
      }
      else {
        setUser(null)
        console.log("user not logged in ");
      }
    })
  }, [])

  const states = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal"
  ];
  useEffect(() => {
    const details = location.state?.orderDetails;
    setOrderDetails(details);
    console.log("order details are ", details);

    let subtotal = 0;

    if (Array.isArray(details)) {
      subtotal = details.reduce((total, item) => total + (item.price || 0), 0);
    } else if (typeof details === 'object' && details !== null) {
      subtotal = details.price || 0;
    }

    console.log("subtotal is", subtotal);
    setSubtotal(subtotal);
  }, []);

  useEffect(() => {
    const effectiveSubtotal = subtotal - discount;
    setShipping(effectiveSubtotal >= 599 ? 0 : 50);
  }, [subtotal, discount]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear field error
  };

  const checkIfFirstOrder = async (userId) => {
    const userOrdersRef = collection(db, `users/${userId}/orders`);
    const snapshot = await getDocs(userOrdersRef);
    return snapshot.empty;
  };

  const applyCoupon = async () => {
    setCouponError("");

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setCouponError("Please login to apply a coupon.");
      return;
    }

    if (form.coupon === 'WELCOME5') {
      const isFirst = await checkIfFirstOrder(user.uid);
      if (isFirst) {
        const discountAmount = subtotal * 0.05;
        setDiscount(discountAmount);
        setCouponApplied(true);
      } else {
        setCouponError("WELCOME5 can only be used for your first order.");
        setForm({ ...form, coupon: "" });
        setDiscount(0);
        setCouponApplied(false);
      }
    } else {
      setCouponError("Invalid coupon code.");
      setForm({ ...form, coupon: "" });
      setDiscount(0);
      setCouponApplied(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^[6-9]\d{9}$/;
    const pinRegex = /^\d{6}$/;

    if (!phoneRegex.test(form.phone)) {
      newErrors.phone = "Enter a valid 10-digit Indian phone number.";
    }
    if (!pinRegex.test(form.pincode)) {
      newErrors.pincode = "Enter a valid 6-digit pincode.";
    }
    if (!form.street) {
      newErrors.street = "Street address is required.";
    }
    if (!form.city) {
      newErrors.city = "City is required.";
    }
    if (!form.state) {
      newErrors.state = "State is required.";
    }
    if (!agreed) {
      newErrors.agreed = "You must agree to the Terms and Conditions.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handlePlaceOrder = async () => {
 
    if (!validateForm()) return;

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Please login first.");
      return;
    }

    const userRef = doc(db, "users", user.uid);

    try {
      for (const item of orderDetails) {
        const totalAmount = (item.price || 0) - discount + shipping;

        const orderData = {
          ...item,
          phone: form.phone,
          address: {
            street: form.street,
            pincode: form.pincode,
            state: form.state,
            city: form.city,
          },
          notes: form.notes,
          status: "Order Requested",
          date: serverTimestamp(),
          totalAmount,
          user: userRef,
        };

        // Add to "orders" collection
        const orderDocRef = await addDoc(collection(db, "orders"), orderData);

        // Add reference under user's orders
        await addDoc(collection(db, `users/${user.uid}/orders`), {
          docRef: orderDocRef,
          date: serverTimestamp(),
        });
      }
      eraseCart();
      alert('Orders placed successfully!');
    } catch (error) {
      console.error("Error placing orders: ", error);
      alert("Failed to place orders. Please try again.");
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4">Checkout</h3>
      <div className="row">
        {/* Left - Form */}
        <div className="col-md-7">
          <form>
            <div className="mb-3">
              <label className="form-label">Phone Number (for tele-verification)</label>
              <input
                type="tel"
                className="form-control"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
              {errors.phone && <div className="text-danger">{errors.phone}</div>}
            </div>

            <h5 className="mt-4">Shipping Address</h5>

            <div className="mb-3">
              <label className="form-label">Street Address</label>
              <input
                type="text"
                className="form-control"
                name="street"
                value={form.street}
                onChange={handleChange}
              />
              {errors.street && <div className="text-danger">{errors.street}</div>}
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  className="form-control"
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                />
                {errors.pincode && <div className="text-danger">{errors.pincode}</div>}
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">State</label>
                <select
                  className="form-select"
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                >
                  <option value="">Select State</option>
                  {states.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
                {errors.state && <div className="text-danger">{errors.state}</div>}
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                />
                {errors.city && <div className="text-danger">{errors.city}</div>}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Order Notes (Optional)</label>
              <textarea
                className="form-control"
                name="notes"
                rows="3"
                value={form.notes}
                onChange={handleChange}
              ></textarea>
            </div>
          </form>
        </div>

        {/* Right - Summary */}
        <div className="col-md-5">
          <div className="card p-3 shadow-sm ">
            <div className='d-flex '>

              {orderDetails.length > 0 && orderDetails.map((item, index) => (
                <img
                  key={index} className='m-1'
                  src={item.photo[0]}
                  alt={`Product ${index + 1}`}
                  style={{ width: "90px", height: "auto", objectFit: "cover", marginBottom: "10px" }}
                />
              ))}
            </div>

            <div className="d-flex justify-content-between">
              <span>Subtotal:</span>
              <strong>₹{subtotal}</strong>
            </div>

            {couponApplied && (
              <div className="d-flex justify-content-between text-success">
                <span>Coupon Discount:</span>
                <strong>- ₹{discount.toFixed(0)}</strong>
              </div>
            )}

            <div className="d-flex justify-content-between">
              <span>Shipping:</span>
              <strong>{shipping === 0 ? "Free" : `₹${shipping}`}</strong>
            </div>

            <div className="d-flex justify-content-between mt-2">
              <span>Total:</span>
              <strong>₹{(subtotal - discount + shipping).toFixed(0)}</strong>
            </div>

            <hr />
            <h5>Apply Coupon</h5>
            <div className="input-group mb-1">
              <input
                type="text"
                className="form-control"
                name="coupon"
                placeholder="Enter coupon code"
                value={form.coupon}
                onChange={handleChange}
              />
              <button className="btn btn-outline-secondary" type="button" onClick={applyCoupon}>
                Apply
              </button>
            </div>
            {couponError && <div className="text-danger">{couponError}</div>}

            <hr />
            <h6>Payment Method</h6>
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="radio"
                name="paymentMethod"
                id="cod"
                checked
                readOnly
              />
              <label className="form-check-label" htmlFor="cod">
                Cash on Delivery (COD)
              </label>
            </div>

            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                id="terms"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="terms">
                I agree with <Link to={"/termsConditions"} target='_blank'>Terms and Conditions</Link>
              </label>
              {errors.agreed && <div className="text-danger">{errors.agreed}</div>}
            </div>

            <button
              className="btn btn-primary w-100"
              onClick={handlePlaceOrder}
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
