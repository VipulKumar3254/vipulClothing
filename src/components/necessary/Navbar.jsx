// import Button from "react-bootstrap/Button";
// import Container from "react-bootstrap/Container";
// import Form from "react-bootstrap/Form";
// import Nav from "react-bootstrap/Nav";
// import Navbar from "react-bootstrap/Navbar";
// import NavDropdown from "react-bootstrap/NavDropdown";
// import logo from "../assets/logo.png";
// function NavScrollExample() {
//   return (
   
//     <Navbar expand="lg" className="bg-body-tertiary">
//       <Container fluid className="">
//         <Navbar.Brand  className="col-xl-1  ms-5 "  href="/"><img width={"70px"}  className=" img-fluid  bg-secondary rounded" src={logo} alt="" /></Navbar.Brand>
//         <Navbar.Toggle aria-controls="navbarScroll" />
//         <Navbar.Collapse id="navbarScroll">
//           <Nav
//             className=" mx-auto my-2 my-lg-0 "
//             style={{ maxHeight: "100px" }}
//             navbarScroll
//           >
//             <Nav.Link href="/jeans">Jeans</Nav.Link>
//             <Nav.Link href="/tshirt">T-Shirts</Nav.Link>
//             <Nav.Link href="/joggers">Joggers</Nav.Link>
//             <Nav.Link href="/shirt">Shirts</Nav.Link>
           
//           </Nav> 
//           <div className="d-flex align-items-center justify-content-evenly">
           
         
//          <div>

//           <Form className="d-flex ">
//             <Form.Control
//               type="search"
//               placeholder="Search"
//               className="me-2"
//               aria-label="Search"
//               />

//             <Button variant="outline-success">Search</Button>
//           </Form>
//               </div>
//           <div className="d-flex justify-content-center m-2">

// <Nav.Link href="/createAccount">
// <div className="d-flex flex-column align-items-center justify-content-center">
//   <span className="material-icons md-36">account_circle</span> account
// </div>
// </Nav.Link>
// <div className="d-flex flex-column ms-5 align-items-center justify-content-center">

//   <span className="material-icons md-36">shopping_cart</span> Cart
// </div>
//   </div>
//           </div>
//         </Navbar.Collapse>
       
//       </Container>
//     </Navbar>

//   );
// }

// export default NavScrollExample;





import React, { useContext, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../assets/logo.png";

import Cart from "../product/cart";
import Account from "../accounts/Account";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../context/context";
import "../../css/navbar.css"

function NavScrollExample() {
  const [showCart, setShowCart] = useState(true);
  const [showAccount, setShowAccount] = useState(false);
  const cartReference= useRef();
  const user = useContext(userContext);
  const navigate = useNavigate();

  const toggleCart = () => {
    // setShowCart(!showCart);
    cartReference.current.classList.toggle("slide-in");
    // console.log(cartReference.current);


  };
  const toggleAccount=()=>{
    navigate("/profile")
    setShowAccount(!showAccount);
  }


  return (
    <>
      <Navbar expand="md" className="bg-body-tertiary">
        <Container fluid>
          <Navbar.Brand className="col-xl-1 ms-5" href="/">
            <img
              width={"90px"}
              className="img-fluid rounded logoImg"
              src={logo}
              alt=""
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="mx-auto my-2 my-lg-0"
              style={{ maxHeight: "220px" }}
              navbarScroll
            >
              {/* <Nav.Link as={Link}  href="/jeans">Jeans</Nav.Link> 
              <Nav.Link as={Link} href="/tshirt">T-Shirts</Nav.Link>
              <Nav.Link as={Link} href="/joggers" className=" d-sm-block d-md-none d-lg-block">Joggers</Nav.Link>
              <Nav.Link as={Link} href="/shirt">Shirts</Nav.Link> */}
               <Link to="/jeans" className="nav-link">Jeans</Link>
              <Link  to="/tshirts" className="nav-link">T-Shirts</Link>
              <Link  to="/joggers" className="nav-link">Joggers</Link>
              <Link  to="/shirts" className="nav-link">Shirts</Link>
              <Link  to="/winterCollection" className="nav-link">Winter Collection</Link>
            </Nav>
            <div className="d-flex align-items-center justify-content-evenly">
              {/* <Form className="d-flex">
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                />
                <Button variant="outline-success">Search</Button>
              </Form> */}
              <div  className="d-flex justify-content-center m-2">
                <Link  to="/profile" className="text-reset text-decoration-none">
                  <div  className="d-flex flex-column align-items-center justify-content-center" >
                    <span className="material-icons md-36">account_circle</span>{" "}
                    { user.user? "Account" : "Login"}
                  </div>
                </Link>
                <div
                  className="d-flex flex-column ms-5 align-items-center justify-content-center"
                  onClick={toggleCart}
                  style={{ cursor: "pointer" }}
                >
                  <span className="material-icons md-36">shopping_cart</span>{" "}
                  Cart
                </div>
              </div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Account Component */}
      {showAccount && <Account toggleAccount={toggleAccount} />}
      {/* Cart Component */}
      <div ref={cartReference}  className="cart-container">

      {showCart && <Cart toggleCart={toggleCart}  />}
      </div>

    </>
  );
}

export default NavScrollExample;
