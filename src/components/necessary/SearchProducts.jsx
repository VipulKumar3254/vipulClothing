import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import "../../css/searchProducts.css"; // Custom CSS for animations
import { db } from "../../../firebaseConfig"; // Adjust the import based on your project structure

const SearchProducts = ({ onClose }) => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true); // for fade-out

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (search.trim() !== "") {
        fetchProducts(search.trim());
      } else {
        setProducts([]);
      }
    }, 300); // 300ms debounce

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const fetchProducts = async (term) => {
    setLoading(true);
    try {
      const q = query(collection(db, "products"), where("title", ">=", term), where("title", "<=", term + "\uf8ff"));
      const snap = await getDocs(q);
      const items = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(items);
    } catch (err) {
      console.error("Search error:", err);
    }
    setLoading(false);
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose(); // actually remove it from DOM
    }, 300); // sync with CSS transition
  };

  return (
    <div className={`search-panel ${visible ? "fade-in" : "fade-out"}`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-outline-danger ms-2" onClick={handleClose}>
          Close
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {products.length > 0 ? (
            <ul className="list-group">
              {products.map((item) => (
                <li className="list-group-item" key={item.id}>
                  {item.title} - ₹{item.price}
                </li>
              ))}
            </ul>
          ) : (
            search && <p>No results found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchProducts;
