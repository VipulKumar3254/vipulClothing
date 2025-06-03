  import React from 'react';

import { Link } from 'react-router-dom';
import "@fontsource/archivo"
import "@fontsource/roboto"


const Footer = () => {
  return (
    <footer className="footer bg-dark pt-5  " style={{color:"white",minHeight:"400px"}} >
      <div className="container">
        <div className="row">
          {/* <div className="col-md-6">
            <h4>About Us</h4>
              <p style={{fontFamily:""}} className="pe-md-3">Kumar Fashion Store is your go-to destination for stylish, affordable, and high-quality clothing. Offering a wide range of apparel for men, women, and children, we cater to all your fashion needs—from casual wear to formal attire. At Kumar Fashion Store, we prioritize comfort, durability, and the latest trends, ensuring that every piece is both fashionable and functional. Visit us today for the best in everyday fashion!</p>
          </div> */}
          <div className="col-md-3 ">

            <h4>Product Categories</h4>
              <li><Link className='link-underline-dark link-secondary' to={"/"}>Jeans</Link> </li>
              <li><Link className='link-underline-dark link-secondary' to={"/"}>Shirts</Link> </li>
              <li><Link className='link-underline-dark link-secondary' to={"/"}>T-Shirts</Link> </li>
              <li><Link className='link-underline-dark link-secondary' to={"/"}>Joggers</Link> </li>
              <li><Link className='link-underline-dark link-secondary' to={"/"}>Formal Pents</Link> </li>

          </div>
            <div className="col-md-3">
              <h4>Join Our Community</h4>
              <li><Link className='link-underline-dark link-secondary' to={"/"}>Instagram</Link> </li>
              <li><Link className='link-underline-dark link-secondary' to={"/"}>Collab with Us</Link> </li>
              <li><Link className='link-underline-dark link-secondary' to={"/"}>Get Sponsored</Link> </li>
              {/* <li><Link className='link-underline-dark link-secondary' to={"/"}>Get Sponsored</Link> </li> */}


            </div>
          <div className="col-md-3">
            <h4>Quick Links</h4>
            <ul className='list-group'>
              <li><Link className='link-underline-dark link-secondary' to={"/"}>Home</Link> </li>
              <li><Link className='link-underline-dark link-secondary' to={"/about"}>About</Link> </li>
              <li><Link  to={"/contact"} className='link-underline-dark link-secondary'>Contact</Link></li>
              <li><Link  to={"/privayPolicy"} className='link-underline-dark link-secondary'>Privacy Policy</Link></li>
              <li><Link  to={"/termsConditions"} className='link-underline-dark link-secondary'>Terms & Conditions</Link></li>
              <li><Link target='_blank' to={"/adminPanel"} className='link-underline-dark link-secondary'>Admin Panel</Link></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h4>Contact Us</h4>
            <p className='m-0 fs-5'>Kumar Fashion Store</p>
            <p className='m-0'>Gyaspur, Sonipat Haryana</p>
            <p className='m-0'>Email: vipulkumar3254@gmail.com</p>
            <p className='m-0'>Phone: +91 8307949189</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-md-12 mt-5">
              <p className="text-center">&copy; 2024 Kumar Fashion Store All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
