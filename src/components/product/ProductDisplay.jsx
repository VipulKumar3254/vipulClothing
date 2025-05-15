import { useContext, useState, useEffect } from "react";
import { db } from "../../../firebaseConfig";
import { collection, query, where, getDocs, orderBy, setDoc, doc, updateDoc } from "firebase/firestore";
import "../../css/ProductDisplay.css";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { filterContext } from "../context/context";
import Spinner from "react-bootstrap/Spinner";
import wishList from "../../assets/wishList1.png";
import { Toaster, toast } from 'react-hot-toast';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const ProductDisplay = ({ category }) => {
    const rs200Products = useLocation();

    // const price =state?.price;
    // console.log("and the price is ",price);

    const filter = useContext(filterContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({});
    const navigate = useNavigate();


     useEffect(() => {
            const auth = getAuth();
            onAuthStateChanged(auth, (user) => {
                setUser(user ? user : null);
            });
        }, []);

    useEffect(() => {
        const fetchData = async () => {
            let q;
            try {
                if (category) {

                    q = query(collection(db, "products"));   

                    //,where("category", "array-contains", category)  
                }
                else {
                    q = query(collection(db, "products"));
                }
                if (filter.lessThan) q = query(q, where("price", "<", filter.lessThan));
                if (filter.orderBy) q = query(q, orderBy("price", filter.orderBy));
                // this is for rs 200 products 
                console.log("rs200Products", rs200Products.state);
                if (rs200Products.state == "200") {
                    q = query(collection(db, "products"), where("price", "<", 200));
                    console.log("less than 200", rs200Products.state);

                }
                console.log("query is", q);
                const querySnapshot = await getDocs(q);

                const productarray = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setProducts(productarray);
                console.log("products are", productarray);
            } catch (e) {
                console.log(e);
            }
            setLoading(false);
        };

        fetchData();
    }, [filter, category]);


    const handleWishList = async(e, product) => {
        e.preventDefault();
        e.stopPropagation();
        console.log("item is ", product);
        let wishListItem = {  title: product.title, price: product.price, photo: product.photo, productId: product.id, userId: user?.uid };

        await setDoc(doc(db, `users/${user.uid}/wishList`, wishListItem.productId), { ...wishListItem });
        // toast.success('Added to Wishlist',{duration:4000})
        toast.custom(
            <div className="bg-success px-4 py-2 rounded-lg shadow-md border rounded-pill border-gray-200 flex items-center space-x-1    text-sm">
              <span className="text-white  fw-medium  fs-6">Added to Wishlist</span>
              <Link
               onClick={(e) => {  e.preventDefault(); e.stopPropagation(); navigate("/wishList")  }}
                
                className="ml-auto bg-blue-600 text-white px-3  rounded-md hover:bg-blue-700 transition"
              >
                See 
              </Link>
            </div>,
            { duration: 6000 }
          );
        //   toast.success('Added to cart', { duration: 4000 });




    }

    return (
        <>
            
            <div className="mt-1 d-block d-md-none text-center">
                <div className="btn btn-secondary px-3" onClick={() => { filter.setFilterShow(!filter.filterShow); }}>Filters</div>
            </div>

            {loading ? (
                <div className="p-2 gridMaker">
                    {/* Placeholder skeleton loaders */}
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="product-placeholder">
                            <div className="skeleton-img"></div>
                            <div className="skeleton-text"></div>
                            <div className="skeleton-price"></div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-2 gridMaker">
                    {products.length > 0 ? (
                        products.map((item) => (
                            <NavLink style={{ position: "relative" }}
                                key={item.id}
                                to="/product/productDesc"
                                state={[item.id, category]}
                                className="product text-decoration-none"
                                id={item.id}
                            >


                                <div className="imgContainer">
                                    <img src={item.photo} className="mx-auto d-block" id="productImg" alt="picture of garment" />
                                    <img
                                        onClick={(e) => { handleWishList(e, item) }}
                                        className=" wishList  wishListIcon wishlist-hover"
                                        src={wishList}
                                        alt="Wishlist"
                                        style={{
                                            position: 'absolute',
                                            top: 9,
                                            left: 9,
                                            width: '30px',
                                            height: '30px',
                                            cursor: 'pointer',
                                            zIndex: 10,
                                        }}
                                    />



                                </div>
                                <div className="d-flex flex-column align-items-start">
                                    <p className="title">{item.title}</p>
                                    <p className="text-start textBlack mt-1 mb-0" style={{ fontSize: "16px" }}>
                                        <span style={{ background: "#32CD32" }}> Free delivery</span> within 1 day on &#8377;399 order
                                    </p>
                                </div>
                                <div className="d-flex justify-content-start align-items-start">
                                    <p className="fs-4 textBlack fwMedium"><sup>&#8377;</sup>{item.price}</p>
                                </div>
                            </NavLink>
                        ))
                    ) : (
                        <div className="text-center fs-5">No products available.</div>
                    )}
                </div>
            )}
        <Toaster position="bottom-left" />

        </>
    );
};

export default ProductDisplay;
