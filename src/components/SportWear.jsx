
import "@fontsource/archivo"
// Supports weights 100-900
import '@fontsource-variable/jost';
import React from "react";
import sportwear from "../assets/sportWear.png";
import { motion } from "framer-motion";
import "../css/sportWear.css";
import { useNavigate } from "react-router-dom";

const SportsWear = () => {
  const navigate = useNavigate();
  return (
    <div className="container-fluid  mt-2 colorChanger" >
      <div className="row align-items-center">
        {/* Left Side - Image (40%) */}
        <div className="col-md-5 d-none d-md-block">
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
            <h2 id="title" className=" fw-normal mb-3   title ">Unmatched Performance in Every Sportwear Drop</h2>
            <p style={{ wordSpacing: "3px" }}  id="subTitle" className=" mb-4 subTitle">
              Grab the best deals on sportswear, from running shoes to gym
              apparel.
              <p className="d-inline d-md-block"> Perfect for your fitness journey.
              </p>
            </p>

            {/* Shop Now Button */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }} className="text-md-start text-center"
            >
              <motion.button on style={{ fontFamily: "Jost Variable", fontWeight: "" }}
                className="btn buyNowSportWear  mb-4"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/sportsWear")}
              >
                Get Something in Bag
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SportsWear;
