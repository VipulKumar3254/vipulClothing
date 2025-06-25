import "@fontsource/archivo";
import SearchIcon from '@mui/icons-material/Search';
import React, { useContext, useEffect, useRef, useState } from "react";
import { Container, Form, Nav, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import logo from "../../assets/logo.webp";
import Cart from "../product/cart";
import Account from "../accounts/Account";
import OfferNavBanner from "./OfferNavBanner";
import { userContext } from "../context/context";
import "../../css/navbar.css";

function NavScrollExample() {
  const [showCart, setShowCart] = useState(true);
  const [showAccount, setShowAccount] = useState(false);
  const [links, setLinks] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [inlineSearchMode, setInlineSearchMode] = useState(false);
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const cartReference = useRef();
  const searchContainerRef = useRef();
  const inputRef = useRef();
  const user = useContext(userContext);
  const navigate = useNavigate();

  const toggleCart = () => cartReference.current.classList.toggle("slide-in");
  const toggleAccount = () => navigate("/profile");

  const handleSearchClick = () => {
    setInlineSearchMode(!inlineSearchMode);
    // setSearch("");
    setSuggestions([]);
    setProducts([]);
    setShowDropdown(false);
  };

 const handleSuggestionClick = (text) => {
  setSearch(text);
  setSuggestions([]);

  // 🔁 delay dropdown close after DOM settles
  setTimeout(() => {
    setShowDropdown(false);
  }, 1); // 100ms delay works fine

  navigate("/search", { state: { fromSearch: true, search: text } });
};

  const handleOutsideClick = (e) => {
    if (
      searchContainerRef.current &&
      !searchContainerRef.current.contains(e.target)
    ) {
      if (!search.trim()) {
        setShowDropdown(false);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [search]);

  useEffect(() => {
    const fetchLinks = async () => {
      const snapshot = await getDocs(collection(db, "admin", "links", "links"));
      setLinks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };
    fetchLinks();
  }, []);

  useEffect(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      setSuggestions([]);
      setProducts([]);
      setShowDropdown(false);
    } else {
      generateSuggestions(term);
      setShowDropdown(true); // only show suggestions
    }
  }, [search]);

  const handleSearch = () => {
    const term = search.trim();
    if (term) {
      fetchProducts(term);
      setSuggestions([]); // hide suggestions
      setShowDropdown(true); // show results
    }
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
        .split(/\s+/)
        .filter(Boolean);

      if (!isNaN(price) && filteredWords.length) {
        const snap = await getDocs(query(collection(db, "products"), where("price", condition, price)));
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
    <>
      <OfferNavBanner />
      <Navbar expand="md" className="bg-body-tertiary p-lg-0" expanded={expanded}>
        <Container fluid>
          <Navbar.Brand className="col-xl-1 ms-5">
            <Link to="/"><img className="img-fluid rounded logoImg" src={logo} alt="logo" /></Link>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="navbarScroll" onClick={() => setExpanded(!expanded)} />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="mx-auto w-100 my-2" navbarScroll>
              {inlineSearchMode ? (
                <div className="w-100 px-3 position-relative" ref={searchContainerRef}>
                  <Form.Control
                    ref={inputRef}
                    type="search"
                    placeholder="Search products..."
                    className="w-100 "
                    style={{ maxWidth: "800px", margin: "0 auto", borderRadius: "8px" }}
                    value={search}
                    autoFocus
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        setSuggestions([]);
                        console.log("i");
                        navigate("/search", { state: { fromSearch: true, search: search } })
                        // handleSearch();
                      }
                    }}
                  />
                  <div className="d-flex justify-content-end mt-2">
                    {/* <button className="btn btn-primary me-2" onClick={handleSearch}>
    Search
  </button> */}
                    {/* <button
    className="btn btn-outline-secondary"
    onClick={() => {
      setSearch("");
      setSuggestions([]);
      setProducts([]);
      setShowDropdown(false);
    }}
  >
    Clear
  </button> */}
                  </div>


                </div>
              ) : (
                <div className="links d-flex flex-column flex-md-row justify-content-start justify-content-md-center align-items-start align-items-md-center w-100">
                  {links.map((link) => (
                    <Link
                      key={link.id}
                      to={link.path}
                      style={{ fontFamily: "archivo" }}
                      className="nav-link text-uppercase fw-bold px-2 py-1"
                      onClick={() => setExpanded(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              )}
            </Nav>

            <div className="d-flex align-items-center justify-content-evenly">
              <div className="d-flex justify-content-center m-2">
                <div className="d-flex flex-column ms-5 align-items-center justify-content-center" onClick={handleSearchClick} style={{ cursor: "pointer" }}>
                  <span className="material-icons md-36">search</span>
                </div>

                <Link to="/profile" className="text-reset text-decoration-none">
                  <div className="d-flex flex-column ms-3 align-items-center justify-content-center">
                    <span className="material-icons md-36">person</span>
                  </div>
                </Link>

                <div className="d-flex flex-column ms-3 align-items-center justify-content-center" onClick={(e) => {
                  setExpanded(false);
                  toggleCart(e);
                }} style={{ cursor: "pointer" }}>
                  <span className="material-icons md-36">shopping_cart</span>
                </div>
              </div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {showDropdown && suggestions.length > 0 && (
        <div className="bg-white shadow p-3 w-100" style={{ maxWidth: "800px", margin: "0 auto", zIndex: 1050, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
          {suggestions.length > 0 && (
            <ul className="list-group mb-3">
              {suggestions.map((s, i) => (
                <li
                  key={i}
                  className="list-group-item list-group-item-action"
                  style={{ cursor: "pointer", fontSize: "0.95rem" }}
                  // onClick={(e) => { }}
                  onClick={(e)=>{
                    e.preventDefault();
                     handleSuggestionClick(s)
                  }}
                >
                  <SearchIcon/>
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
                    onClick={() => navigate(`/product/productDesc/${item.id}`)}
                    style={{ cursor: "pointer" }}
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

      {showAccount && <Account toggleAccount={toggleAccount} />}
      <div ref={cartReference} className="cart-container">
        {showCart && <Cart toggleCart={toggleCart} />}
      </div>
    </>
  );
}

export default NavScrollExample;
