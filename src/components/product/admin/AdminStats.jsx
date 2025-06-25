import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react"
import { app, db } from "../../../../firebaseConfig";
import { getFunctions, httpsCallable } from "firebase/functions";
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';

const AdminStats = () => {
    const [userCount, setUserCount] = useState(0);
    const [orderCount, setOrderCount] = useState(0);
    const [productCount, setProductCount] = useState(0);
    const [isAdmin, setIsAdmin] = useState(null);
    const [loadingUsers, setLoadingUsers] = useState(true);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingOrders, setLoadingOrders] = useState(true);

    const fetchCounts = async () => {
        try {
            const functions = getFunctions(app);

            const getTotalUsers = httpsCallable(functions, 'getTotalUsers');
            const getTotalOrders = httpsCallable(functions, 'getTotalOrders');
            const getTotalProducts = httpsCallable(functions, 'getTotalProducts');

            const [usersRes, ordersRes, productsRes] = await Promise.all([
                getTotalUsers(),
                getTotalOrders(),
                getTotalProducts(),
            ]);

            setUserCount(usersRes.data.totalUsers);
            setOrderCount(ordersRes.data.totalOrders);
            setProductCount(productsRes.data.totalProducts);

        } catch (error) {
            console.error("Error fetching counts:", error.message);
        } finally {
            setLoadingUsers(false);
            setLoadingOrders(false);
            setLoadingProducts(false);
        }
    };

    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (!user) return;
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().isAdmin) {
                setIsAdmin(true);
                fetchCounts();
            } else {
            }
        });
    }, []);


    return (
        <>
            <div className="container py-4">
                <h2 className="text-center mb-4">Admin Dashboard</h2>

                <div className="row g-4  ">
                    {/* Users Card */}
                    <div className="col-md-4">
                        <div className="card  shadow-sm border-0">
                            <div className="card-body ">
                                <div className=" p-2 bg-light d-inline  rounded">

                                    <PeopleOutlineOutlinedIcon   />
                                </div>
                                <h5 className="card-title mt-5 text-secondary">Customers</h5>
                                {loadingUsers ? (
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    <p className="display-6 fs-1 fw-bold">{userCount}</p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card  shadow-sm border-0">
                            <div className="card-body ">
                                <div className=" p-2 bg-light d-inline  rounded">

                                    <ShoppingBagOutlinedIcon />
                                </div>
                                <h5 className="card-title mt-5 text-secondary">Orders</h5>
                                {loadingUsers ? (
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    <p className="display-6 fs-1 fw-bold">{orderCount}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="card  shadow-sm border-0">
                            <div className="card-body ">
                                <div className=" p-2 bg-light d-inline  rounded">

                                    <CategoryOutlinedIcon   />
                                </div>
                                <h5 className="card-title mt-5 text-secondary">Products</h5>
                                {loadingUsers ? (
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                ) : (
                                    <p className="display-6 fs-1 fw-bold">{productCount}</p>
                                )}
                            </div>
                        </div>
                    </div>



                    {/* Products Card */}
                    
                </div>
            </div>
        </>
    )
}


export default AdminStats