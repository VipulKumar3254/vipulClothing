import { useContext, useState, useEffect } from "react";
import { db } from "../../../firebaseConfig";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import dummy from "../../assets/dummy.png";
import "../../css/ProductDisplay.css";
import { Link, NavLink } from "react-router-dom";
import { filterContext } from "../context/context";
import Spinner from 'react-bootstrap/Spinner';
const ProductDisplay = ({ category }) => {
    console.log(category);
    const filter = useContext(filterContext);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            console.log(filter);
            try {
                console.log("less than", filter.lessThan);
                let q = query(collection(db, "products"), where("category", "array-contains", category));
                if (filter.lessThan) q = query(q, where("price", "<", filter.lessThan));
                if (filter.orderBy) q = query(q, orderBy("price", filter.orderBy));
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

    if (loading) {
        return (
            <div className=" position-absolute top-50 start-50 d-flex justify-content-center align-items-center" style={{ minHeight: "400px" ,transform: "translate(-50%,-90%)"}}>
                <Spinner animation="border" variant="primary" />
            </div>
        );
    }

    return (
        <>

            <div  className="mt-1 d-block d-md-none text-center">
                <div className="btn btn-secondary px-3" onClick={() => { filter.setFilterShow(!filter.filterShow); }}>filters</div>
            </div>
            <div className="p-2 gridMaker" >
                {products.length > 0 ? (
                    products.map(item => (
                        <NavLink to="/product/productDesc" state={[item.id, category]} className="product  text-decoration-none" id={item.id}>
                            <div className="imgContainer">
                                <img src={item.photo}  className="mx-auto d-block img-fluid" style={{ borderRadius: "3px" }} alt="picture of garment" />
                            </div>
                            <div className="d-flex flex-column align-items-start">
                                <p className="title">{item.title}</p>
                                <p className="text-start textBlack mt-1 mb-0" style={{ fontSize: "16px" }}><span style={{ background: "#32CD32" }}> Free delivery</span> within 1 day on &#8377;399 order</p>
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

        </>
    );
};

export default ProductDisplay;
