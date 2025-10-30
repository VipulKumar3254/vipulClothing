"use client";
import SpinnerOverlay from "./SpinnerOverlay";
import toast, { Toaster } from "react-hot-toast";
import Script from "next/script";
import "@fontsource-variable/jost";
import React, { useEffect, useState } from "react";
//   import { useNavigate } from "react-router-dom";
import { useRouter } from "next/navigation";
import gif from "@/../public/gif.gif";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db, app } from "@/firebaseConfig";
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from "firebase/functions";

import {
  collection,
  getDocs,
  doc,
  addDoc,
  serverTimestamp,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";
import { useAccordionButton } from "react-bootstrap";

const Checkout = () => {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode"); // "buy-now" | "cart"
  const router = useRouter();
  const functions = getFunctions(app);
  const [user, setUser] = useState({});
  //   const location = useLocation();
  const [orderDetails, setOrderDetails] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [shipping, setShipping] = useState(0);
  const [errors, setErrors] = useState({});
  const [removeCart, setRemoveCart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [showAnimation, setShowAnimation] = useState(false);
  const [payment, setPayment] = useState({ orderId: "df", paymentId: null });
  const [loading, setLoading] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const [loadingPayment,setLoadingPayment] = useState(true)
  const [form, setForm] = useState({
    phone: "",
    street: "",
    pincode: "",
    state: "",
    city: "",
    notes: "",
    coupon: "",
  });

  //  setting the user
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
        setUser(user);
      } else {
        setUser(null);
        console.log("user not logged in ");
      }
    });
  }, []);
useEffect(() => {
  if (!user) return;

  let unsubscribe; // define it for cleanup
  setLoading(true);

  if (mode === "buy-now") {
    const raw = sessionStorage.getItem("buyNow");
    const product = raw ? JSON.parse(raw) : null;
    setOrderDetails(product ? [product] : []);

    const subtotal = product ? product.price : 0;
    setSubtotal(subtotal);

    setLoading(false);
  } else {
    const cartRef = collection(db, `users/${user.uid}/cart`);
    unsubscribe = onSnapshot(cartRef, (snapshot) => {
      const cartData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setOrderDetails(cartData);

      const subtotal = cartData.reduce(
        (total, item) => total + (item.price || 0),
        0
      );
      console.log("subtotal is", subtotal);
      setSubtotal(subtotal);

      setLoading(false);
    });
  }

  return () => {
    if (unsubscribe) unsubscribe(); // cleanup
  };
}, [user, mode]);

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

  const states = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Delhi",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ];

 
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

    if (form.coupon === "WELCOME5") {
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
       if (!razorpayLoaded) {
      alert("Payment system is still loading. Please wait a moment.");
      return;
    }

    if (!validateForm()) return;
    if (!user) {
      alert("Please login first.");
      return;
    }
    setLoading(true); // 🔥 Show spinner

    const userRef = doc(db, "users", user.uid);
    const productsToSend = orderDetails.map((item) => ({
      productId: item.productId,
      quantity: item.quantity || 1,
    }));

    // 2. Prepare full order data for Firestore
    const fullOrder = {
      userId: user.uid,
      phone: form.phone,
      address: {
        street: form.street,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },
      notes: form.notes || "",
      products: [...orderDetails], // <--- ALL PRODUCTS from cart
      subtotal,
      discount,
      shipping,
      totalAmount: subtotal - discount + shipping,
      razorpayOrderId: null,
      paymentStatus: "Pending",
      status: "Order Requested",
      createdAt: serverTimestamp(),
    };

    // 3. Save to global orders
    const orderDocRef = await addDoc(collection(db, "orders"), fullOrder);
    const orderId = orderDocRef.id;

    // 4. Save reference under user's orders
    await addDoc(collection(db, `users/${user.uid}/orders`), {
      docRef: orderDocRef,
      date: serverTimestamp(),
    });

    if (paymentMethod === "online") {
      // 💳 Razorpay path
      // connectFunctionsEmulator(functions, "localhost", 5001);
      const createOrder = httpsCallable(functions, "orderWala");
      const res = await createOrder({ products: productsToSend });
      const orderData = res.data;
      console.log("from the server", res.data);

      const options = {
        key: "rzp_test_WuIdTI6w0lb8jL",
        amount: orderData.amount,
        currency: "INR",
        name: "Kumar Fashion Store",
        description: "Payment for your order",
        image: "/logo.png",
        order_id: orderData.id,

        handler: async function (response) {
          setLoading(false);
          setPayment({
            orderId: orderDocRef.id,
            paymentId: response.razorpay_payment_id,
          });

          setShowAnimation(true);
          console.log("Payment successful:", response);
          await updateDoc(doc(db, "orders", orderId), {
            paymentStatus: "Paid",
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: orderData.id,
          });
          setTimeout(() => {
            router.push("/orders", {
              state: {
                orderId: orderId,
                paymentId: response.razorpay_payment_id,
              },
            });
          }, 10000); // 8 second delay
        },

        modal: {
          ondismiss: async function () {
            await updateDoc(doc(db, "orders", orderId), {
              paymentStatus: "Pending payment failed",
              razorpayOrderId: orderData.id,
              retryTimestamp: serverTimestamp(),
            });
            setLoading(false);

            toast.custom(
              (t) => (
                <div
                  className="toaster bg-warning text-white px-5 py-2  shadow-sm d-flex justify-content-between align-items-center "
                  style={{
                    fontFamily: "Jost Variable",
                    fontSize: "12px",
                    width: "",
                  }}
                >
                  <span className="text-center">
                    You didn't complete the payment.Please try again.
                  </span>

                  <button
                    className="btn btn-sm btn-light ms-3"
                    onClick={() => toast.dismiss(t.id)}
                    style={{ fontSize: "12px" }}
                  >
                    Close
                  </button>
                </div>
              ),
              { duration: 3000 }
            );
          },
        },
        prefill: {
          name: user.displayName || "Customer",
          email: user.email,
          contact: form.phone,
        },
        notes: {
          address: `${form.street}, ${form.city}, ${form.state}`,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razor = new window.Razorpay(options);
      razor.open();
    } else {
      // 🧾 COD path
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
            paymentStatus: "Pending (COD)",
          };

          const orderDocRef = await addDoc(collection(db, "orders"), orderData);
          await addDoc(collection(db, `users/${user.uid}/orders`), {
            docRef: orderDocRef,
            date: serverTimestamp(),
          });
        }
        console.log(orderDocRef.id);
        console.log(orderDocRef);

        if (removeCart) {
          eraseCart();
        }
        setLoading(false);

        setShowAnimation(true);
        setPayment({ orderId: orderDocRef.id });
        setTimeout(() => {
          navigate("/orders", {
            state: {
              orderId: orderId,
            },
          });
        }, 10000); // 8 second delay

        // alert("COD order placed successfully!");
      } catch (error) {
        setLoading(false);

        console.error("Error placing COD order: ", error);
        toast.custom(
          (t) => (
            <div
              className="toaster bg-error text-white px-5 py-2  shadow-sm d-flex justify-content-between align-items-center "
              style={{
                fontFamily: "Jost Variable",
                fontSize: "12px",
                width: "",
              }}
            >
              <span className="text-center">
                Error in Placing the order. Please try again.
              </span>

              <button
                className="btn btn-sm btn-light ms-3"
                onClick={() => toast.dismiss(t.id)}
                style={{ fontSize: "12px" }}
              >
                Close
              </button>
            </div>
          ),
          { duration: 3000 }
        );
      }
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => {
          console.log("Razorpay script loaded");
          setRazorpayLoaded(true);
        }}
      />
      <div className="container mt-5">
        <h3 style={{ fontFamily: "Jost Variable" }} className="mb-4">
          Checkout
        </h3>
        <div className="row">
          {/* Left - Form */}
          <div className="col-md-7">
            <form style={{ fontFamily: "Jost Variable" }}>
              <div className="mb-3">
                <label className="form-label">
                  Phone Number (for tele-verification)
                </label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                />
                {errors.phone && (
                  <div className="text-danger">{errors.phone}</div>
                )}
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
                {errors.street && (
                  <div className="text-danger">{errors.street}</div>
                )}
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
                  {errors.pincode && (
                    <div className="text-danger">{errors.pincode}</div>
                  )}
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
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                  {errors.state && (
                    <div className="text-danger">{errors.state}</div>
                  )}
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
                  {errors.city && (
                    <div className="text-danger">{errors.city}</div>
                  )}
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
          <div style={{ fontFamily: "Jost Variable" }} className="col-md-5">
            <div className="card p-3 shadow-sm ">
              <div className="d-flex ">
                {orderDetails.length > 0 &&
                  orderDetails.map((item, index) => (
                    <img
                      key={index}
                      className="m-1"
                      src={item.photo[0]}
                      alt={`Product ${index + 1}`}
                      style={{
                        width: "90px",
                        height: "auto",
                        objectFit: "cover",
                        marginBottom: "10px",
                      }}
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
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={applyCoupon}
                >
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
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                  readOnly
                />
                <label className="form-check-label" htmlFor="cod">
                  Cash on Delivery (COD)
                </label>
              </div>
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="cod"
                  readOnly
                  checked={paymentMethod === "online"}
                  onChange={() => setPaymentMethod("online")}
                />
                <label className="form-check-label" htmlFor="cod">
                  Pay via UPI / Card / Netbanking
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
                  I agree with{" "}
                  <Link href={"/termsConditions"} target="_blank">
                    Terms and Conditions
                  </Link>
                </label>
                {errors.agreed && (
                  <div className="text-danger">{errors.agreed}</div>
                )}
              </div>

              <button
                className="btn btn-primary w-100"
                onClick={handlePlaceOrder}
              >
            {razorpayLoaded ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {showAnimation && (
        <div>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              backgroundColor: "#28a745", // Green background
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              textAlign: "center",
            }}
          >
            <img
              src={gif} // ✅ Replace with your gif path
              alt="Success"
              style={{ width: "", marginBottom: "20px" }}
            />

            <h2>Payment Successful!</h2>
            <div className="">
              <h4 className="d-inline">Order Id:</h4>
              <p className="d-inline"> {payment.orderId}</p> <br />
              {payment.paymentId && (
                <>
                  <h4 className="d-inline">Payment Id: </h4>{" "}
                  <p className="d-inline">{payment.paymentId}</p>
                </>
              )}
            </div>
            <div className="mt-3">
              {paymentMethod == "cod" && (
                <>
                  Our team will contact you as soon as possible for
                  tele-verification.
                </>
              )}
              <p className="">Your order has been placed. Redirecting...</p>
            </div>
          </div>
        </div>
      )}
      <Toaster position="bottom-left" />

      {loading && <SpinnerOverlay />}
    </>
  );
};
export default Checkout;
