import React from 'react';
import { Link } from 'react-router-dom';


const Footer = () => {
  return (
    <footer className="footer bg-dark pt-5 " style={{color:"white"}} >
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h4>About Us</h4>
            <p className='pe-md-3'>Our moto is to deliever cloths in budget with quality. We offer variety of  good quality garments keeping your pocket light.</p>
          </div>
          <div className="col-md-3">
            <h4>Quick Links</h4>
            <ul className='list-group'>
              <li><a className='link-underline-dark link-secondary'  href="#">Home</a></li>
              <li><Link className='link-underline-dark link-secondary' to={"/about"}>About</Link> </li>
              <li><Link  to={"/contact"} className='link-underline-dark link-secondary'>Contact</Link></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h4>Contact Us</h4>
            <p>Vipul Clothing</p>
            <p>Gyaspur, Sonipat Haryana</p>
            <p>Email: vipulClothing3254@gmail.com</p>
            <p>Phone: +91 8307949189</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <p className="text-center">&copy; 2024 Vipul Clothing All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
