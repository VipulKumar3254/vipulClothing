import React, { useEffect, useRef, useState } from 'react';
import { Nav } from 'react-bootstrap';
import contact from "../../assets/profile/contactUs.png";
import orders from "../../assets/profile/orders.png";
import wishList from "../../assets/profile/wishList.png";
import Cart from '../product/cart';
import "../../css/profile.css";
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebaseConfig';
import { Link, useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import "@fontsource/archivo"
function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCart, setShowCart] = useState(true);
    const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
    const cartReference = useRef();
    const navigate = useNavigate();
    const tempProfileImg = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userRef = doc(db, "users", user.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        setUser(userSnap.data());
                        setProfilePhotoUrl(userSnap.data().profilePhotoUrl);
                    } else {
                        alert("Please try again later");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                console.log("Not logged in");
                setUser(null);
                navigate("/login");
            }
            setLoading(false);
        });
    }, [navigate]);

    const logout = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            window.location.reload();
        }).catch((err) => {
            console.log(err);
        });
    };

    const toggleCart = () => {
        cartReference.current.classList.toggle("slide-in");
    };

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <>
        <div className='mb-5'>

            {user ? (
                <>
                    <div className="container mt-3">
                        <div className='row'>
                            <div className='col-lg-2'>
                                <img className='img-fluid' src={profilePhotoUrl ? user.profilePhotoUrl : tempProfileImg} alt="profile" />
                                <h4  className='fontFamily text-center mt-2 fs-3'>Hi, {user.name ? user.name : "there"}</h4>
                            </div>
                        </div>
                    </div>

                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-3 col-md-6 col-12 border rounded m-2 text-center">
                                <div className="row align-items-center justify-content-center">
                                    <div className="col-3">
                                        <img className="img-fluid profileImg" src={orders} alt="Orders" />
                                    </div>
                                    <Link className=" fontFamily col-3 col-md-6 text-decoration-none text-black col-xl-9 fs-2 d-flex align-items-center justify-content-center" to="/orders">
                                        Orders
                                    </Link>
                                </div>
                                <p className=' fontFamily d-none d-md-block'>Track, return, or buy something else</p>
                            </div>

                            <div className="col-lg-3 col-md-6 col-12 border rounded m-2 text-center">
                                <div className="row align-items-center justify-content-center">
                                    <div className="col-3">
                                        <img className="img-fluid profileImg" src={wishList} alt="Wish List" />
                                    </div>
                                    <Link className="fontFamily col-3 col-md-6 text-decoration-none text-black col-xl-9 fs-2 d-flex align-items-center justify-content-center" to="/wishList">
                                        WishList
                                    </Link>
                                </div>
                                <p className='fontFamily d-none d-md-block'>Save items for later for convenience</p>
                            </div>

                            <div className="col-lg-3 col-md-6 col-12 border rounded m-2 text-center">
                                <div className="row align-items-center justify-content-center">
                                    <div className="col-3">
                                        <img className="img-fluid profileImg" src={contact} alt="Contact Us" />
                                    </div>
                                    <Link className="fontFamily col-5 col-md-8 text-decoration-none text-black col-xl-9 fs-2 d-flex align-items-center justify-content-center" to="/contact">
                                        Contact Us
                                    </Link>
                                </div>
                                <p className='fontFamily d-none d-md-block'>Need help? Don't worry, we are here</p>
                            </div>

                            <div className="col-lg-3 col-md-6 col-12 border rounded m-2 text-center" onClick={toggleCart}>
                                <div className="row align-items-center justify-content-center">
                                    <div className="col-3">
                                        <img className="img-fluid profileImg" src={contact} alt="Cart" />
                                    </div>
                                    <Link className="fontFamily col-3 col-md-6 text-decoration-none text-black col-xl-9 fs-2 d-flex align-items-center justify-content-center" to="#">
                                        Cart
                                    </Link>
                                </div>
                                <p className='fontFamily d-none d-md-block'>Come on! Order, we are waiting</p>
                            </div>

                            <div className="col-lg-3 col-md-6 col-12 border rounded m-2 text-center" onClick={logout}>
                                <div className="row align-items-center justify-content-center">
                                    <div className="col-3">
                                        <img className="img-fluid profileImg" src={contact} alt="Log Out" />
                                    </div>
                                    <Link className="fontFamily col-3 col-md-6 text-decoration-none text-black col-xl-9 fs-2 d-flex align-items-center justify-content-center" to="#">
                                        Log Out
                                    </Link>
                                </div>
                                <p className='fontFamily d-none d-md-block'>See you soon, have a nice day</p>
                            </div>
                        </div>
                    </div>

                    <div ref={cartReference} className="cart-container">
                        {showCart && <Cart toggleCart={toggleCart} />}
                    </div>
                </>
            ) : (
                <div className="" style={{ minHeight: "400px" }}>
                    <p className='text-center fs-5'>Please login to continue</p>
                </div>
            )}
                </div>
        </>
    );
}

export default Profile;
