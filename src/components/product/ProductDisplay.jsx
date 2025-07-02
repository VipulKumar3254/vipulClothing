import "@fontsource/archivo";
import "@fontsource-variable/jost"
import { useContext, useState, useEffect } from "react";
import { db } from "../../../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  startAfter,
  endBefore,
  limit
} from "firebase/firestore";
import { useLocation, NavLink, useNavigate } from "react-router-dom";
import { filterContext } from "../context/context";
import Spinner from "react-bootstrap/Spinner";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import wishList from "../../assets/wishList1.png";
import { toast, Toaster } from "react-hot-toast";
import "../../css/productDisplay.css"

const ProductDisplay = ({ category }) => {
  const filter = useContext(filterContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [firstDoc, setFirstDoc] = useState(null);
  const [prevDocs, setPrevDocs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const productsPerPage = 8;

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (usr) => setUser(usr || null));
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [filter, category, location.state]);

  const buildQuery = (startPoint = null, direction = "next") => {
    let q = collection(db, "products");

    if (location.state?.search) return null; // handled separately

    if (location.pathname === "/rs200Products") {
      q = query(q, where("price", "<", 900));
    } else if (category) {
      q = query(q, where("category", "array-contains", category));
    }

    if (filter.lessThan) {
      q = query(q, where("price", "<", filter.lessThan));
    }

    if (filter.orderBy) {
      q = query(q, orderBy("price", filter.orderBy));
    } else {
      q = query(q, orderBy("price", "asc"));
    }

    if (startPoint) {
      q = direction === "next"
        ? query(q, startAfter(startPoint))
        : query(q, endBefore(startPoint));
    }

    q = query(q, limit(productsPerPage));
    return q;
  };

  const fetchProducts = async (startPoint = null, direction = "next") => {
    setLoading(true);

    if (location.state?.search) {
      await searchProducts(location.state.search);
      return;
    }

    const q = buildQuery(startPoint, direction);
    if (!q) return;

    const snapshot = await getDocs(q);
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    if (direction === "next") {
      if (startPoint) setPrevDocs(prev => [...prev, startPoint]);
      setCurrentPage(prev => prev + 1);
    } else if (direction === "prev") {
      setPrevDocs(prev => prev.slice(0, -1));
      setCurrentPage(prev => Math.max(1, prev - 1));
    }

    setProducts(items);
    setFirstDoc(snapshot.docs[0]);
    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    setLoading(false);
  };

  const searchProducts = async (term) => {
    const map = new Map();
    const underMatch = term.match(/under\s+(\d+)/);
    const aboveMatch = term.match(/above\s+(\d+)/);
    const price = parseInt(underMatch?.[1] || aboveMatch?.[1]);
    const condition = underMatch ? "<=" : ">=";
    const filteredWords = term.replace(/under\s+\d+|above\s+\d+/g, "")
      .split(/\s+/).filter(Boolean);

    try {
      if (!isNaN(price) && filteredWords.length) {
        const snap = await getDocs(query(collection(db, "products"), where("price", condition, price)));
        snap.docs.forEach(doc => {
          const data = doc.data();
          const title = data.title?.toLowerCase() || "";
          const tags = (data.tags || []).map(t => t.toLowerCase());
          if (filteredWords.some(w => title.includes(w) || tags.includes(w))) {
            map.set(doc.id, { id: doc.id, ...data });
          }
        });
      } else {
        const snap = await getDocs(query(collection(db, "products"), where("title", ">=", term), where("title", "<=", term + "\uf8ff")));
        snap.docs.forEach(doc => map.set(doc.id, { id: doc.id, ...doc.data() }));

        const tagSearches = term.split(/\s+/).map(w =>
          getDocs(query(collection(db, "products"), where("tags", "array-contains", w)))
        );

        const results = await Promise.all(tagSearches);
        results.forEach(snap => snap.docs.forEach(doc => map.set(doc.id, { id: doc.id, ...doc.data() })));

        const exact = await getDocs(query(collection(db, "products"), where("price", "==", parseInt(term))));
        exact.docs.forEach(doc => map.set(doc.id, { id: doc.id, ...doc.data() }));
      }

      setProducts(Array.from(map.values()));
      setCurrentPage(1);
      setLoading(false);
    } catch (err) {
      console.error("Search error", err);
    }
  };
const handleWishList = async (e, product) => {
  e.preventDefault();
  e.stopPropagation();

  const wishListItem = {
    title: product.title,
    price: product.price,
    photo: product.photo,
    productId: product.id,
    userId: user?.uid,
  };

  try {
    if (!user) {
      throw new Error("User not logged in");
    }

    await setDoc(doc(db, `users/${user.uid}/wishList`, product.id), wishListItem);
 toast.custom((t) => (
      <div
        className="toaster bg-success text-white px-5 py-2  shadow-sm d-flex justify-content-between align-items-center "
        style={{ fontFamily: "Jost Variable", fontSize: "12px",width:"" }}
      >
        <span className="text-center">Added to WishList</span>
      
        <button
          className="btn btn-sm btn-light ms-3"
          onClick={() => toast.dismiss(t.id)}
          style={{ fontSize: "12px" }}
        >
          Close
        </button>
      </div>
    ), { duration: 5000 });
  

  } catch (err) {
    console.error(err);

    const message = err.message === "User not logged in"
      ? "Please login to add items to wishlist"
      : "Something went wrong";

    toast.custom((t) => (
      <div
        className=" toaster bg-danger text-white px-5 py-2  shadow-sm d-flex justify-content-between align-items-center"
        style={{ fontFamily: "Jost Variable", fontSize: "12px" }}
      >
        <span>{message}</span>
        <button
          className="btn btn-sm btn-light ms-3"
          onClick={() => toast.dismiss(t.id)}
          style={{ fontSize: "12px" }}
        >
          Close
        </button>
      </div>
    ), { duration: 5000 });
  }
};

  return (
    <>
      <div className="mt-1 d-block d-md-none text-center" style={{ fontFamily: "Jost Variable" }}>
        <div className="btn btn-secondary px-3" onClick={() => filter.setFilterShow(!filter.filterShow)}>Filters</div>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
          <Spinner animation="border" variant="primary" style={{ width: "3rem", height: "3rem" }} />
        </div>
      ) : (
        <div className="container mt-3 px-1">
          <div className="row g-0 g-md-4">
            {products.length > 0 ? (
              products.map((item) => (
                <div className="col-6 col-md-3 " key={item.id}>
                  <NavLink to="/product/productDesc" state={[item.id, category]} className="card h-100 text-decoration-none rounded-0 border-0 " style={{ backgroundColor: "#F7F7F7" }}>
                    <div className="position-relative">
                      <img src={item.photo} className="card-img-top" alt={item.title}

                      />

                      {/* <img
                        onClick={(e) => handleWishList(e, item)}
                        src={wishList}
                        className="position-absolute top-0 start-0 m-2"
                        style={{ width: "30px", height: "30px", cursor: "pointer", zIndex: 10 }}
                        alt="Wishlist"
                      /> */}
                    </div>
                    <div className="card-body mt-1 px-1" style={{ fontFamily: "Jost Variable" }}>
                      <h5 className="card-title fw-normal text-dark"
                      >{item.title}</h5>
                      <p className="card-text text-muted p-0 mb-0 " style={{ fontSize: "12px" }}>
                        <span className="badge bg-success text-start ">Free delivery</span> on ₹599+
                      </p>
                    <div className="mt-2  ">
                      <p
                        style={{ backgroundColor: "#FFCE12", fontSize: "11px" }}
                        className=" d-inline  px-3 py-1  border rounded-5 cursor-pointer"
                        onClick={(e) => handleWishList(e, item)}

                        >
                        Add to Wishlist
                      </p>
                    </div>
                      <p className="fw-medium text-dark fs-6 mb-0 mt-2 ms-0 " >Rs. {item.price}</p>
                    </div>
                  </NavLink>
                </div>
              ))
            ) : (
              <div className="col-12 text-center fs-5">No products available.</div>
            )}
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
            <button className="btn btn-outline-secondary" onClick={() => fetchProducts(prevDocs[prevDocs.length - 1], "prev")} disabled={currentPage === 1}>
              Prev
            </button>
            <span>Page {currentPage}</span>
            <button className="btn btn-outline-primary" onClick={() => fetchProducts(lastDoc)} disabled={products.length < productsPerPage}>
              Next
            </button>
          </div>
        </div>
      )}

      <Toaster position="bottom-left" />
    </>
  );
};

export default ProductDisplay;
