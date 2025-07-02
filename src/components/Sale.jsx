import React from "react";
import "@fontsource-variable/jost"
import { motion, scale } from "framer-motion";
import bannerImg from "../assets/200Product.png"; // Replace with your image path
import "../css/sale.css"
import { Link, useNavigate } from "react-router-dom";
import e from "cors";
const HeroSection = () => {
  const navigate = useNavigate();
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
              <motion.h2 style={{ fontFamily: "Jost Variable" }}
                className=" mb-3  fw-normal text-shadow1"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Get any Product at 250/- only
              </motion.h2>

              <motion.p style={{ fontFamily: "Jost Variable" , wordSpacing:"3px"}}
                className="fs   mb-4 text-shadow "
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Don’t miss the chance to upgrade your wardrobe with our
                affordable premium collection.
              </motion.p>

              <motion.div
                className=""
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                whileHover={{ scale: 1.1 }}

              >
                <button className=" fw-normal  btn btn-dark" onClick={(e) => {
                  e.preventDefault();
                  navigate("/rs200Products") 

                }}
                >Buy Now</button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
