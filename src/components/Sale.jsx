import React from "react";
import { motion } from "framer-motion";
import bannerImg from "../assets/200Product.png"; // Replace with your image path
import "../css/sale.css"
const HeroSection = () => {
  return (
    <div
      className="d-flex align-items-center "
      style={{
        backgroundImage: `url(${bannerImg})`, // Replace this
        backgroundSize: "cover ",
        backgroundPosition: "top",
        minHeight: "70vh",
        width: "100%",
      }}
    >
      <div className="container mx-0">
        <div className="row align-items-center ">
          <div className="col-md-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className=" bg-opacity-75 p-4 rounded-4 dropShadow"
            >
              <motion.h1
                className="display-5 fw-bold mb-3 text-dark text-uppercase text-shadow1"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Get any Product at 250/- only
              </motion.h1>

              <motion.p
                className="lead text-secondary mb-4 text-shadow "
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Don’t miss the chance to upgrade your wardrobe with our
                affordable premium collection.
              </motion.p>

              <motion.a
                href="#shop"
                className="btn btn-dark btn-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                Shop Now
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
