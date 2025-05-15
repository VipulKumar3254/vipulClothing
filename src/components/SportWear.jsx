import React from "react";
import sportwear from "../assets/sportWear.png";
import { motion } from "framer-motion";
import "../css/sportWear.css";

const SportsWear = () => {
  return (
    <div className="container-fluid  mt-5">
      <div className="row align-items-center">
        {/* Left Side - Image (40%) */}
        <div className="col-md-5">
        <motion.img
  src={sportwear}
  alt="Sportswear"
  className="img-fluid"
  style={{ objectFit: "cover", borderRadius: "10px", width: "100%" }} // <-- added width: 100%
  initial={{ opacity: 0, x: -100 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 1 }}
/>

        </div>

        {/* Right Side - Text (60%) */}
        <div className="col-md-7">
          <motion.div
            className="text-container"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <h2 className="mb-4 text-uppercase">Flat 10% Off on All Sports Wear</h2>
            <p className="lead mb-4">
              Grab the best deals on sportswear, from running shoes to gym
              apparel. <br /> Perfect for your fitness journey.
            </p>

            {/* Shop Now Button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <motion.button
                className="btn btn-dark px-5 py-2 fs-5 fw-bold text-uppercase"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => alert("Shop Now clicked!")} 
              >
                Shop Now
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SportsWear;
