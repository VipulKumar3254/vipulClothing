import "@fontsource/archivo"

import { db } from "../../../../firebaseConfig";
import { useLocation, useParams } from "react-router-dom";
import { collection, query, where, getDocs, addDoc, setDoc, doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import "../../../css/ProductDesc.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "@fontsource/poppins"


//desc banner images
import returnlogo from "../../../assets/DescBanner/return.png";
import homeDelivery from "../../../assets/DescBanner/homeDelivery.png";
import cod from "../../../assets/DescBanner/cod.png";
import Comments from "./Comments";
import MoreLikeThis from "./MoreLikeThis";
import toast, { Toaster } from "react-hot-toast";

const ProductDesc = () => {
    let { id } = useParams();
    const [purchase, setPurchase] = useState({});
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [user, setUser] = useState({});
    const [product, setProduct] = useState(null);
    const [showTerms, setShowTerms] = useState(false); // Controls the visibility of Terms & Conditions
    const [selectedColor, setSelectedColor] = useState("");
    const navigate = useNavigate();


    const location = useLocation();
    id = location.state ? location.state[0] : id;

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            setUser(user ? user : null);
        });
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docRef = doc(db, "products", id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProduct({ ...docSnap.data(), id: docSnap.id });
                    console.log("product data is ", docSnap.data());
                    console.log("id of the product is ", docSnap.id);
                } else {
                    console.log("No such document!");
                }
            } catch (e) {
                console.log(e);
            }
        };
        fetchData();
    }, [location.state]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setPurchase({ ...purchase, [name]: value });

        if (name === "color") {
            setSelectedColor(value);
        }
        console.log("purchasing item is ", purchase);
    };

    const purchaseSet = () => {
        let cartItem = { ...purchase, title: product.title, price: product.price, photo: product.photo, productId: product.id, userId: user?.uid };
        setPurchase(cartItem);
        return cartItem;
    };

    const addToCart = async () => {
        if (!user) {
            alert("Login to continue");
            return;
        }
        if (!purchase.size || !purchase.color) {
            alert("Choose size and color");
            return;
        }

        let cartItem = purchaseSet();
        try {
            const docRef = doc(db, "users", user.uid, 'cart', product.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {

                const data = docSnap.data();
                if (data.size === cartItem.size && data.color === cartItem.color) {
                    toast.custom(
                        <div className="bg-success px-4 py-2 rounded-lg shadow-md border rounded-pill border-gray-200 flex items-center space-x-1    text-sm">
                            <span className="text-white  fw-medium  fs-6">Already In cart</span>

                        </div>,
                        { duration: 6000 }
                    );
                    return;

                }
            }
            await setDoc(doc(db, `users/${user.uid}/cart`, cartItem.productId), { ...cartItem });
            toast.custom(
                <div className="bg-success px-4 py-2 rounded-lg shadow-md border rounded-pill border-gray-200 flex items-center space-x-1    text-sm">
                    <span className="text-white  fw-medium  fs-6">Added to Cart</span>

                </div>,
                { duration: 6000 }
            );
        } catch (err) {
            console.log("Error while adding to cart:", err);
        }
    };

    const handleBuyClick = () => {
        if (!user) {
            alert("Please login first to continue");
            return;
        }
        if (!purchase.size || !purchase.color) {
            alert("Choose size and color");
            return;
        }
        setShowTerms(true); // Show the Terms & Conditions prompt
    };

    const confirmPurchase = async () => {
        setShowTerms(false); // Hide the terms prompt

        let cartItem = purchaseSet();
        try {
            const orderData = {
                ...cartItem,
                userId: user.uid, // Use user ID instead of document reference
                status: "Order Requested",
                date: new Date().toISOString(), // Serialize date
            };
            navigate(`/checkout`, {
                state: { orderDetails: orderData },
            });
            return;

            const userRef = doc(db, "users", user.uid);
            const docRef = await addDoc(collection(db, "orders"), { ...cartItem, user: userRef, status: "Order Requested", date: new Date() });

            await addDoc(collection(db, `users/${user.uid}/orders`), { docRef });
            alert("Purchase successful");
        } catch (err) {
            console.log("Error while purchasing:", err);
        }
    };

    return (
        <>
            <div>
                {product ? (
                    <>
                        <div className="container-fluid">
                            <div className="row position-relative">
                                {/* Thumbnail images of product */}
                                <div className="col-xl-5">
                                    <div>

                                        <div className="col-lg-1  d-flex   flex-row   ">
                                            {product.photo.map((photo, index) => (
                                                <div className="mt-2 ms-1" key={index} style={{ height: "50px", width: "35px" }}>
                                                    <img
                                                        className="border rounded"
                                                        style={{ height: "50px", width: "35px", background: "#F7F7F7" }}
                                                        src={photo}
                                                        alt="Product Thumbnail"
                                                        onClick={() => setSelectedImageIndex(index)}
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        <div className="col-lg-12 col-12 ">
                                            <img className="productImg mx-auto d-block" src={product.photo[selectedImageIndex]} alt="Product" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-7  ">
                                    <p style={{ fontFamily: "archivo" }} className="fs-2 mt-5 ms-2">{product.title}</p>
                                    <div className="pe-5">

                                    <p style={{ fontFamily: "archivo" }} className="fs-5 ms-2 pe-5">{product.subTitle}</p>
                                    </div>
                                    <p className="fs-3 ms-2 fw-medium"><sup style={{ fontSize: "13px" }}> &#8377;</sup>{product.price}</p>

                                    <div className="mt-3 text-center d-flex">
                                        <div className="m-2 mx-3">
                                            <img style={{ height: "30px" }} src={returnlogo} alt="Return Policy" />
                                            <p style={{ fontSize: "12px" }}>10 Day Return</p>
                                        </div>
                                        <div className="m-2 mx-3">
                                            <img style={{ height: "30px" }} src={homeDelivery} alt="Home Delivery" />
                                            <p style={{ fontSize: "12px" }}>Fast Delivery</p>
                                        </div>
                                        <div className="m-2 mx-3">
                                            <img style={{ height: "30px" }} src={cod} alt="COD Available" />
                                            <p style={{ fontSize: "12px" }}>Cash on Delivery</p>
                                        </div>
                                    </div>

                                    <p className="mt-1 fs-6">Size</p>
                                    <select className="border rounded" name="size" onChange={handleChange}>
                                        <option value="">Select</option>
                                        {product.sizes?.map((size, index) => (
                                            <option key={index} value={size}>{size}</option>
                                        ))}
                                    </select>

                                    <p className="mt-3 fs-6">Color</p>
                                    <div>
                                        {product.color?.map((color, index) => (
                                            <div key={index} className="d-inline text-center ms-2">
                                                <input type="radio" name="color" className="d-none" onChange={(e) => {
                                                    handleChange(e);
                                                    setSelectedImageIndex(index)
                                                }} value={color} id={color} />
                                                <label htmlFor={color}>
                                                    <img src={product.photo[index]} style={{ height: "80px", width: "60px", objectFit: "cover" }} className={` ms-2 ${selectedColor == color ? "highlighedImage" : ""}`} alt={color} />
                                                    <p>{color}</p>
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="row mt-3">
                                        <button className="col-lg-2 btn btn-warning" onClick={addToCart}>Add to Cart</button>
                                        <button className="col-lg-2 btn btn-success ms-0 mt-1 ms-md-2 mt-md-0" onClick={handleBuyClick}>Buy Now</button>
                                    </div>
                                </div>
                            </div>

                            <h2 style={{ fontFamily: "arial" }} className="mt-5 fs-1 fw-semibold text-center">Product Description</h2>
                            <div className="container row  mx-auto mt-5 ">
                                <div className="col-12  ">


                                    {product.desc.map((section, index) => (
                                        <div key={index} className="mb-3" style={{ fontFamily: "poppins" }}>
                                            <h4>{section.title}</h4>
                                            <p className="fs-6">{section.desc}</p>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>
                    </>
                ) :
                    (
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-xl-5">
                                    <div className="skeleton skeleton-img"></div>
                                </div>
                                <div className="col-lg-7">
                                    <div className="skeleton skeleton-text"></div>
                                    <div className="skeleton skeleton-text"></div>
                                    <div className="skeleton skeleton-text skeleton-small"></div>
                                    <div className="d-flex mt-3">
                                        <div className="skeleton skeleton-text me-2" style={{ width: "100px", height: "30px" }}></div>
                                        <div className="skeleton skeleton-text" style={{ width: "100px", height: "30px" }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )

                }
            </div>

            {/* Terms & Conditions Modal */}
            <div className="terms-modal  rounded  " style={{ display: showTerms ? "block" : "none" }}>

                <div>
                    <p className="text-center fs-4 fw-medium">Please read and accept the Terms & Conditions before proceeding.</p>
                    <ul>

                        <li className="fs-5">Its Cash On Delivery Service.</li>
                        <li className="fs-5">We hold the right to Cancel the order at any time.</li>
                        <li className="fs-5">Your Profile Address will be reffered for delivery.</li>
                        <li className="fs-5">You may receive a call for the confirmation of the order.</li>
                        <li className="fs-5">This is the service for the local area by <span className="fw-bold">Kumar Fashion Store</span>. No distinct orders will be taken.</li>
                        <li className="fs-5">Color accuracy of the product is  not 100% due to technical limitations. Product may have slightly other texture or feel.</li>
                        <li className="fs-5">We promise 1 day delivery for the nearest locations. If you are not close then it make take 2 days. You will be informed in such case.</li>
                        <li className="fs-5">Order's first phase is the order request, you need to wait to confirm the order. Owner may cancel order for any reason. Once order is confirmed, order will be delivered within one day.</li>
                        <li className="fs-5">A confirmation of the same will be sent toyou either on WhatsApp or by SMS.</li>
                    </ul>
                </div>
                <div className="text-end">

                    <button className="btn btn-success" onClick={confirmPurchase}>Proceed</button>
                    <button className="btn btn-danger ms-2" onClick={() => setShowTerms(false)}>Cancel</button>
                </div>
            </div>


            {/* comments section  */}

            <Comments product={product} />

            {/* more like this  */}
            <MoreLikeThis product={product} />
            <Toaster position="bottom-left" />

        </>
    );
};

export default ProductDesc;
