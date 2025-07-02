import React, { useEffect, useRef, useState } from "react";
// Supports weights 100-900
import '@fontsource-variable/jost';
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import SearchIcon from '@mui/icons-material/Search';
import "@fontsource/archivo";

const SearchProducts = () => {
  const [search, setSearch] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [products, setProducts] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (!search.trim()) setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [search]);

  useEffect(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      setSuggestions([]);
      setProducts([]);
      setShowDropdown(false);
    } else {
      generateSuggestions(term);
      setShowDropdown(true);
    }
  }, [search]);

  const handleSearch = () => {
    const term = search.trim();
    if (term) {
      fetchProducts(term);
      setSuggestions([]);
      setShowDropdown(true);
    }
  };

  const handleSuggestionClick = (text) => {
    setSearch(text);
    setSuggestions([]);
    setTimeout(() => setShowDropdown(false), 1);
    navigate("/search", { state: { fromSearch: true, search: text } });
  };

  const generateSuggestions = (term) => {
    const s = new Set();
    if (term.includes("men")) {
      s.add("mens jeans under 600");
      s.add("mens jeans under 1000");
      s.add("mens shirts under 900");
      s.add("mens joggers under 900");
    }
    if (term.includes("shirt")) s.add("shirt under 500");
    if (term.includes("tshirt")) s.add("tshirt under 300");
    setSuggestions(Array.from(s));
  };

  const fetchProducts = async (term) => {
    const map = new Map();
    try {
      const underMatch = term.match(/under\s+(\d+)/);
      const aboveMatch = term.match(/above\s+(\d+)/);
      const price = parseInt(underMatch?.[1] || aboveMatch?.[1]);
      const condition = underMatch ? "<=" : ">=";
      const filteredWords = term.replace(/under\s+\d+|above\s+\d+/g, "")
        .split(/\s+/).filter(Boolean);

      if (!isNaN(price) && filteredWords.length) {
        const snap = await getDocs(query(
          collection(db, "products"), where("price", condition, price)
        ));
        snap.docs.forEach(doc => {
          const data = doc.data();
          const title = data.title?.toLowerCase() || "";
          const tags = (data.tags || []).map(t => t.toLowerCase());
          const match = filteredWords.some(w => title.includes(w) || tags.includes(w));
          if (match) map.set(doc.id, { id: doc.id, ...data });
        });
      } else {
        const snap = await getDocs(query(
          collection(db, "products"),
          where("title", ">=", term),
          where("title", "<=", term + "\uf8ff")
        ));
        snap.docs.forEach(doc => map.set(doc.id, { id: doc.id, ...doc.data() }));

        const tagSearches = term.split(/\s+/).map(w =>
          getDocs(query(collection(db, "products"), where("tags", "array-contains", w)))
        );
        const results = await Promise.all(tagSearches);
        results.forEach(snap => {
          snap.docs.forEach(doc => map.set(doc.id, { id: doc.id, ...doc.data() }));
        });

        const priceQuery = parseInt(term);
        if (!isNaN(priceQuery)) {
          const exact = await getDocs(query(collection(db, "products"), where("price", "==", priceQuery)));
          exact.docs.forEach(doc => map.set(doc.id, { id: doc.id, ...doc.data() }));
        }
      }
    } catch (err) {
      console.error("Error searching:", err);
    }
    setProducts(Array.from(map.values()));
  };

  return (
    <div className="position-relative w-100 mx-auto pb-2 px-2" ref={containerRef} style={{ maxWidth: "800px", margin: "", }}>
      <input
        type="text" style={{fontFamily:"Jost Variable"}}
        className="form-control"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
          }
        }}
      />

      {showDropdown && (suggestions.length > 0 || products.length > 0) && (
        <div className="bg-white shadow p-3 position-absolute w-100" style={{ zIndex: 1050 }}>
          {suggestions.length > 0 && (
            <ul className="list-group mb-3">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  className="list-group-item list-group-item-action d-flex align-items-center"
                  style={{ cursor: "pointer", fontSize: "0.95rem" }}
                  onClick={() => handleSuggestionClick(s)}
                >
                  <SearchIcon className="me-2" />
                  {s}
                </li>
              ))}
            </ul>
          )}

          {products.length > 0 && (
            <>
              <h6 className="text-muted">Results</h6>
              <ul className="list-group">
                {products.map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item d-flex align-items-center"
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/product/productDesc/${item.id}`)}
                  >
                    <img
                      src={item.photo}
                      alt=""
                      style={{ maxHeight: "100px", width: "80px", objectFit: "cover", marginRight: "12px" }}
                    />
                    <div>
                      <div>{item.title}</div>
                      <div className="text-muted">₹{item.price}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchProducts;
