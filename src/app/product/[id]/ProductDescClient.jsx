"use client";
import "@fontsource-variable/jost";
import "@/styles/productDesc.css"

import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";
import returnlogo from "@/../public/DescBanner/return.png";
import homeDelivery from "@/../public/DescBanner/homeDelivery.png";
import cod from "@/../public/DescBanner/cod.png";

export default function ProductDescClient({ product }) {
  const [purchase, setPurchase] = useState({});
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [user, setUser] = useState(null);
  const [showTerms, setShowTerms] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (usr) => setUser(usr || null));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPurchase({ ...purchase, [name]: value });
    if (name === "color") setSelectedColor(value);
  };

  const purchaseSet = () => {
    return {
      ...purchase,
      title: product.title,
      price: product.price,
      photo: product.photo,
      productId: product.id,
      userId: user?.uid,
    };
  };

  const addToCart = async () => {
    if (!user) return toast.error("Please login to continue");
    if (!purchase.size || !purchase.color)
      return toast.error("Please choose size and color");

    const cartItem = purchaseSet();
    const docRef = doc(db, `users/${user.uid}/cart`, product.id);
    const docSnap = await getDoc(docRef);

    if (
      docSnap.exists() &&
      docSnap.data().size === cartItem.size &&
      docSnap.data().color === cartItem.color
    ) {
      return toast.error("Already in cart");
    }

    await setDoc(docRef, cartItem);
    toast.success("Added to cart");
  };

  const handleBuyClick = () => {
    if (!user) return toast.error("Please login to continue");
    if (!purchase.size || !purchase.color)
      return toast.error("Choose size and color");
    confirmPurchase();
  };

  const confirmPurchase = () => {
    const cartItem = purchaseSet();
    // router.push(`/checkout?order=${encodeURIComponent(JSON.stringify([cartItem]))}`);

    sessionStorage.setItem("buyNow", JSON.stringify(cartItem));
    router.push("/checkout?mode=buy-now");
  };

  return (
    <>
      <div className="container-fluid">
        {/* Product Images */}
        <div className="row">
          <div className="col-xl-5">
            <div className="d-flex flex-row">
              {product.photo.map((photo, index) => (
                <div className="mt-2 ms-1" key={index}>
                  <Image
                    src={photo}
                    alt="Product Thumbnail"
                    width={35}
                    height={50}
                    onClick={() => setSelectedImageIndex(index)}
                    className="border rounded"
                  />
                </div>
              ))}
            </div>
            <Image
              className="productImg mx-auto d-block"
              src={product.photo[selectedImageIndex]}
              width={500}
              height={500} 
              
              alt="Product"
            />
          </div>

          {/* Product Details */}
          <div className="col-lg-7" style={{ fontFamily: "Jost Variable" }}>
            <h2 className="fs-2 mt-5 ms-2 fw-normal">{product.title}</h2>
            <p className=" d-none d-md-block fs-5 ms-2 pe-5">
              {product.subTitle}
            </p>
            <p className="fs-3 ms-2 fw-medium">
              <sup>&#8377;</sup>
              {product.price}
            </p>

            {/* Delivery Icons */}
            
            <div
              className="mt-3 text-center d-flex"
              style={{ fontFamily: "Jost Variable" }}
            >
              <div className="m-2 mx-3">
                <Image height={30}
                  style={{ height: "30px" }}
                  src={returnlogo}
                  alt="Return Policy"
                />
                <p style={{ fontSize: "12px" }}>10 Day Return</p>
              </div>
              <div className="m-2 mx-3">
                <Image
                  style={{ height: "30px" }} height={30}
                  src={homeDelivery}
                  alt="Home Delivery"
                />
                <p style={{ fontSize: "12px" }}>Fast Delivery</p>
              </div>
              <div className="m-2 mx-3">
                <Image syle={{ height: "30px" }} height={30} src={cod} alt="COD Available" />
                <p style={{ fontSize: "12px" }}>Cash on Delivery</p>
              </div>
            </div>

            {/* Size */}
             <p style={{ fontFamily: "Jost Variable" }} className="mt-1 fs-6">Size</p>
                                    <select style={{ fontFamily: "Jost Variable" }} className="border rounded" name="size" onChange={handleChange}>
                                        <option value="">Select</option>
                                        {product.sizes?.map((size, index) => (
                                            <option key={index} value={size}>{size}</option>
                                        ))}
                                    </select>

            {/* Color */}
            <p style={{ fontFamily: "Jost Variable" }} className="mt-3 fs-6">Color</p>
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


            <div className="mt-3">
              <button className="col-lg-2 btn btn-warning rounded-0 py-2" onClick={addToCart}>
                Add to Cart
              </button>
              <button className="col-lg-2 btn btn-success rounded-0 ms-0 py-2 mt-2 ms-md-2 mt-md-0" onClick={handleBuyClick}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
      <div>
        <h2
          style={{ fontFamily: "Jost Variable" }}
          className="mt-5 fs-1 fw-normal text-center"
        >
          Product Description
        </h2>
        <div className="container row  mx-auto mt-5 ">
          <div className="col-12  ">
            {product.desc.map((section, index) => (
              <div
                key={index}
                className="mb-3 "
                style={{ fontFamily: "Jost Variable" }}
              >
                <h4 style={{ fontWeight: "400" }}>{section.title}</h4>
                <p className="fs-6">{section.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
