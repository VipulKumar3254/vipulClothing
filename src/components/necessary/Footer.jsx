  import React from 'react';
import { Link } from 'react-router-dom';


const Footer = () => {
  return (
    <footer className="footer bg-dark pt-5 " style={{color:"white"}} >
      <div className="container">
        <div className="row">
          <div className="col-md-6">
            <h4>About Us</h4>
            {/* <p className='pe-md-3'>Our moto is to deliever cloths in budget with quality. We offer variety of  good quality garments keeping your pocket light.</p> */}
            {/* <div className="pe-md-3">Luxe Threads is a contemporary clothing brand dedicated to blending high-quality fabrics with stylish, timeless designs. Founded on the belief that fashion should be both comfortable and versatile, Luxe Threads offers a range of apparel that complements every lifestyle. Whether you're dressing for work, leisure, or a night out, Luxe Threads ensures that you look effortlessly chic without compromising on comfort. With a commitment to sustainability and ethical practices, the brand sources materials responsibly, making fashion choices that are good for both you and the planet.</div> */}
              <p className="pe-md-3">Kumar Fashion Store is your go-to destination for stylish, affordable, and high-quality clothing. Offering a wide range of apparel for men, women, and children, we cater to all your fashion needs—from casual wear to formal attire. At Kumar Fashion Store, we prioritize comfort, durability, and the latest trends, ensuring that every piece is both fashionable and functional. Visit us today for the best in everyday fashion!</p>



          </div>
          <div className="col-md-3">
            <h4>Quick Links</h4>
            <ul className='list-group'>
              <li><Link className='link-underline-dark link-secondary' to={"/"}>Home</Link> </li>
              <li><Link className='link-underline-dark link-secondary' to={"/about"}>About</Link> </li>
              <li><Link  to={"/contact"} className='link-underline-dark link-secondary'>Contact</Link></li>
              <li><Link target='_blank' to={"/adminPanel"} className='link-underline-dark link-secondary'>Admin Panel</Link></li>
            </ul>
          </div>
          <div className="col-md-3">
            <h4>Contact Us</h4>
            <p className='m-0 fs-5'>Kumar Fashion Store</p>
            <p className='m-0'>Gyaspur, Sonipat Haryana</p>
            <p className='m-0'>Email: vipulClothing3254@gmail.com</p>
            <p className='m-0'>Phone: +91 8307949189</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <p className="text-center">&copy; 2024 Kumar Fashion Store All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
