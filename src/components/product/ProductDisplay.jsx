import { useContext, useState, useEffect } from "react";
import { db } from "../../../firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import "../../css/ProductDisplay.css";
import { Link, NavLink,useLocation } from "react-router-dom";
import { filterContext } from "../context/context";
import Spinner from "react-bootstrap/Spinner";

const ProductDisplay = ({ category }) => {
    const rs200Products = useLocation();
  
    // const price =state?.price;
    // console.log("and the price is ",price);

    const filter = useContext(filterContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            let q;
            try {
                if(category)
                {

                     q = query(collection(db, "products"), where("category", "array-contains", category));
                }
                else{
                    q= query(collection(db, "products"));
                }
                if (filter.lessThan) q = query(q, where("price", "<", filter.lessThan));
                if (filter.orderBy) q = query(q, orderBy("price", filter.orderBy));
                // this is for rs 200 products 
                console.log("rs200Products", rs200Products.state);
                if (rs200Products.state=="200") 
                    {
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
                            <NavLink 
                                key={item.id} 
                                to="/product/productDesc" 
                                state={[item.id, category]} 
                                className="product text-decoration-none" 
                                id={item.id}
                            >
                                <div className="imgContainer">
                                    <img src={item.photo} className="mx-auto d-block" id="productImg" alt="picture of garment" />
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
        </>
    );
};

export default ProductDisplay;
