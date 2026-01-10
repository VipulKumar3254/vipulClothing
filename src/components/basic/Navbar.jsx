import PersonIcon from "@mui/icons-material/Person";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Link from "next/link";
import { Container, Nav, Navbar } from "react-bootstrap";
import { db } from "@/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import logo from "@/../public/logo.png";
import Cart from "@/components/basic/cart";
import "@/styles/navbar.css";


// 🔹 Fetch navigation links server-side
async function getLinks() {
  const snapshot = await getDocs(collection(db, "admin", "links", "links"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export default async function NavScrollExample() {
  const links = await getLinks();

  return (
    <>
      <Navbar expand="md" className="bg-body p-lg-0">
        <Container fluid className=" ">
          <Navbar.Toggle aria-controls="navbarScroll" className="border-0" />
          <Navbar.Brand className="col-xl-1 ms-5">
            <Link href="/">
              <img
                className="img-fluid rounded logoImg"
                src={logo.src}
                alt="kumar fashion store"
              />
            </Link>
          </Navbar.Brand>

          {/* Mobile user/cart */}
          <div className="d-flex d-md-none">
            <Link href="/profile" className="text-reset text-decoration-none">
              <div className="d-md-flex d-none  flex-column ms-3 align-items-center justify-content-center">
                <PersonIcon />
              </div>
            </Link>
            <div
              className="d-md-flex d-none  flex-column ms-3 align-items-center justify-content-center"
              style={{ cursor: "pointer" }}
            >
              <ShoppingCartIcon />
            </div>
          </div>

          <Navbar.Collapse
            id="navbarScroll"
            className="mobile-full-height"
          >
            <Nav className="mx-auto w-100 my-2 justify-content-center" navbarScroll>
              {links.map((link) => (
                <Link
                  key={link.id}
                  href={link.path}
                  className=" link nav-link"
                  id="link"
                >
                   {link.name}
                </Link>
              ))}
            </Nav>

            {/* Desktop user/cart */}
            <div className="d-flex align-items-center justify-content-evenly">
              <div className="d-flex justify-content-center m-2">
                <Link href="/profile" className="text-reset text-decoration-none">
                  <div className="d-md-flex d-none  flex-column ms-3 align-items-center justify-content-center">
                    <PersonIcon />
                  </div>
                </Link>
                <div
                  className="d-md-flex d-none  flex-column ms-3 align-items-center justify-content-center"
                  style={{ cursor: "pointer" }}
                >
                  <ShoppingCartIcon />
                </div>
              </div>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Cart (needs client handling for toggle) */}
      <div className="cart-container">
        <Cart />
      </div>
    </>
  );
}
