import { useEffect, useState, useRef } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import "../../css/searchProducts.css";
import { db } from "../../../firebaseConfig";
import { useNavigate } from "react-router-dom";

const SearchProducts = ({ onClose }) => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [inputFocused, setInputFocused] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      const term = search.trim().toLowerCase();
      if (term !== "") {
        fetchProducts(term);
        generateSuggestions(term);
      } else {
        setProducts([]);
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const generateSuggestions = (term) => {
    const suggestionsSet = new Set();

    if (term.includes("men")) {
      suggestionsSet.add("mens jeans under 400");
      suggestionsSet.add("mens shirt under 500");
      suggestionsSet.add("mens tshirt under 300");
    }
    if (term.includes("shirt")) {
      suggestionsSet.add("shirt under 500");
      suggestionsSet.add("shirt under 600");
      suggestionsSet.add("cotton shirt");
    }
    if (term.includes("jeans")) {
      suggestionsSet.add("jeans under 700");
      suggestionsSet.add("black jeans");
    }
    if (term.includes("tshirt")) {
      suggestionsSet.add("tshirt under 300");
      suggestionsSet.add("oversized tshirt");
    }

    setSuggestions(Array.from(suggestionsSet));
  };

  const fetchProducts = async (term) => {
    setLoading(true);
    const productsMap = new Map();

    try {
      const underMatch = term.match(/under\s+(\d+)/);
      const aboveMatch = term.match(/above\s+(\d+)/);

      let priceValue = null;
      let priceCondition = null;
      let filteredWords = [];

      if (underMatch || aboveMatch) {
        priceValue = parseInt(underMatch?.[1] || aboveMatch?.[1]);
        priceCondition = underMatch ? "<=" : ">=";

        filteredWords = term
          .replace(/under\s+\d+|above\s+\d+/g, "")
          .split(/\s+/)
          .filter(Boolean);
      }

      if (priceValue !== null && filteredWords.length > 0) {
        const priceQuery = query(
          collection(db, "products"),
          where("price", priceCondition, priceValue)
        );
        const priceSnap = await getDocs(priceQuery);

        priceSnap.docs.forEach((doc) => {
          const data = doc.data();
          const title = data.title?.toLowerCase() || "";
          const tags = data.tags?.map((tag) => tag.toLowerCase()) || [];

          const matchesKeyword = filteredWords.some(
            (word) => title.includes(word) || tags.includes(word)
          );

          if (matchesKeyword) {
            productsMap.set(doc.id, { id: doc.id, ...data });
          }
        });

        setProducts(Array.from(productsMap.values()));
        setLoading(false);
        return;
      }

      const titleQuery = query(
        collection(db, "products"),
        where("title", ">=", term),
        where("title", "<=", term + "\uf8ff")
      );
      const titleSnap = await getDocs(titleQuery);
      titleSnap.docs.forEach((doc) =>
        productsMap.set(doc.id, { id: doc.id, ...doc.data() })
      );

      const words = term.split(/\s+/).filter(Boolean);
      const tagPromises = words.map((word) => {
        const tagQuery = query(
          collection(db, "products"),
          where("tags", "array-contains", word)
        );
        return getDocs(tagQuery);
      });

      const tagResults = await Promise.all(tagPromises);
      tagResults.forEach((snap) => {
        snap.docs.forEach((doc) =>
          productsMap.set(doc.id, { id: doc.id, ...doc.data() })
        );
      });

      const num = parseInt(term);
      if (!isNaN(num)) {
        const priceExact = query(
          collection(db, "products"),
          where("price", "==", num)
        );
        const priceSnap = await getDocs(priceExact);
        priceSnap.docs.forEach((doc) =>
          productsMap.set(doc.id, { id: doc.id, ...doc.data() })
        );
      }

      setProducts(Array.from(productsMap.values()));
    } catch (err) {
      console.error("Search error:", err);
    }

    setLoading(false);
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div className={`search-panel ${visible ? "fade-in" : "fade-out"}`}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search products..."
          value={search}
          ref={inputRef}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-outline-danger ms-2" onClick={handleClose}>
          Close
        </button>
      </div>

      {suggestions.length > 0 && inputFocused && (
        <div className="mb-3">
          <div className="fw-bold mb-2">Suggestions:</div>
          <ul className="list-group">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="list-group-item list-group-item-action"
                onMouseDown={() => setSearch(suggestion)}
                style={{ cursor: "pointer" }}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {products.length > 0 ? (
            <ul className="list-group">
              {products.map((item) => (
                <li
                  className="list-group-item d-flex align-items-center"
                  key={item.id}
                  onClick={() => navigate(`/product/productDesc/${item.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    style={{
                      maxHeight: "100px",
                      width: "80px",
                      objectFit: "cover",
                      marginRight: "10px",
                    }}
                    src={item.photo}
                    alt=""
                  />
                  <div>
                    <div>{item.title}</div>
                    <div className="text-muted">₹{item.price}</div>
                  </div>
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
