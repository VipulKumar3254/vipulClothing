import React, { useContext, useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../assets/logo.webp";

import Cart from "../product/cart";
import Account from "../accounts/Account";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../context/context";
import "../../css/navbar.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import SearchProducts from "./SearchProducts";
// import { httpsCallable,getFunctions } from "firebase/functions";
// import { app } from "../../../firebaseConfig";
// const functions = getFunctions(app);
// const sayHello = httpsCallable(functions, 'sayHello');
// sayHello().then(res => {
//   console.log("hii",res.data); // Hello from Cloud Functions!
// });

function NavScrollExample() {
  
  const [showCart, setShowCart] = useState(true);
  const [showAccount, setShowAccount] = useState(false);
  const [links, setLinks] = useState([]);
  const [expanded, setExpanded] = useState(false); // ✅ Add expanded state
    const [showSearch, setShowSearch] = useState(false);
  
  const cartReference = useRef();
  const user = useContext(userContext);
  const navigate = useNavigate();

  const toggleCart = () => {
    cartReference.current.classList.toggle("slide-in");
  };

  const toggleAccount = () => {
    navigate("/profile");
    setShowAccount(!showAccount);
  };



  useEffect(() => {
    // that is a firebase cloud function url fetch request
    // fetch("https://helloworld-2lqzdbkk7q-uc.a.run.app").then((response) => { return response.json();
    // }).then((data) => { console.log(data);})
    const fetchLinks = async () => {
      try {
        const adminCollectionRef = collection(db, "admin", "links", "links");
        const snapshot = await getDocs(adminCollectionRef);
        const linksList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLinks(linksList);
        console.log("and the list is ",linksList);
      } catch (error) {
        console.error("Error fetching links: ", error);
      }
    };
    fetchLinks();
    
  }, []);
  return (
    <>
    <div className="bg-dark">
      <p className="text-center text-light m-0 p-2 fs-5">
        
      Get 10% off on your first order with code <span className="text-danger">WELCOME10</span>
      </p>

    </div>
      <Navbar expand="md" className="bg-body-tertiary p-lg-0" expanded={expanded}>
        <Container fluid>
          <Navbar.Brand className="col-xl-1 ms-5">
            <Link to="/">
              <img  className="img-fluid rounded logoImg" src={logo} alt="" />
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" onClick={() => setExpanded(!expanded)} />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="mx-auto my-2  " navbarScroll>
              {/* <Link to="/jeans" className="nav-link" onClick={() => setExpanded(false)}>Jeans</Link>
              <Link to="/shirts" className="nav-link" onClick={() => setExpanded(false)}>Shirts</Link> */}
              {
              links && links.length>0 ?
                links.map((link)=>{
                 return  <Link to={link.path} className="nav-link text-uppercase fw-bold " onClick={() => setExpanded(false)}>{link.name}</Link>
                })
               :"" }

            </Nav>
            <div className="d-flex align-items-center justify-content-evenly">
              <div className="d-flex justify-content-center m-2">
              <div className="d-flex flex-column ms-5 align-items-center justify-content-center" 
                     onClick={(e) =>{setShowSearch(true) }}
                     style={{ cursor: "pointer" }}>
                  <span className="material-icons md-36">search</span>{" "}
                  {/* Cart */}
                </div>  
                <Link to="/profile" className="text-reset text-decoration-none" onClick={() => setExpanded(false)}>
                  <div className="d-flex flex-column ms-3 align-items-center justify-content-center">
                    <span className="material-icons md-36">person</span>{" "}
                    {/* {user.user ? "Account" : "Login"} */}
                  </div>
                </Link>
              
                <div className="d-flex flex-column ms-3 align-items-center justify-content-center" 
                     onClick={(e) =>{ setExpanded(false); toggleCart(e)}}
                     style={{ cursor: "pointer" }}>
                  <span className="material-icons md-36">shopping_cart</span>{" "}
                  {/* Cart */}
                </div>
              </div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Account Component */}
      {showAccount && <Account toggleAccount={toggleAccount} />}
      {/* Cart Component */}
      <div ref={cartReference} className="cart-container">
        {showCart && <Cart toggleCart={toggleCart} />}
      </div>
                      {showSearch && <SearchProducts onClose={() => setShowSearch(false)} />}
      
    </>
  );
}

export default NavScrollExample;
