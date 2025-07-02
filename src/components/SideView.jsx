import "../css/SideView.css";
// Supports weights 100-900
import '@fontsource-variable/jost';
import "@fontsource-variable/eb-garamond"

import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import img1 from "../assets/img7.png";
import img2 from "../assets/img6.png";
import img3 from "../assets/img5.png";

const slides = [
  {
    img: img1,
    title: "Summer Vibes",
    desc: "Light and breezy fits for the season.",
    link:"joggers"
  },
  {
    img: img2,
    title: "Beach Ready",
    desc: "Look great while staying cool.",
    link:"tshirts"
  },
  {
    img: img3,
    title: "Street Style",
    desc: "Trendy picks for your daily grind.",
    link:"shirts"
  },
];

function SideView() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setIndex((prev) => (prev + newDirection + slides.length) % slides.length);

    
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.6 },
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      transition: { duration: 0.4 },
    }),
  };

  return (
    <div className="carousel position-relative overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={index}
          className="carousel-slide d-flex"
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {/* Text Section */}
          <div className="text-section d-flex flex-column justify-content-center align-items-center px-4 py-4 ">
            <motion.h3
            style={{fontWeight:"500"}}
              className="text-title "
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {slides[index].title}
            </motion.h3>
            <motion.p
              className="text-muted"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {slides[index].desc}
            </motion.p>
            <motion.div  
              className="btn btn-outline-dark  bg-white px-4 mt-3 text-center bg-transparent"
                style={{ maxWidth: "200px", width: "100%" }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            > <Link to={`/${slides[index].link}`} className="  text-decoration-none text-dark text-uppercase"> Buy Now</Link>
            </motion.div>
          </div>

          {/* Image Section */}
          <div className="image-section d-flex align-items-center justify-content-center">
            <motion.img
              src={slides[index].img}
              alt={slides[index].title}
              className="carousel-img"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6 }}
            />
          </div>
          
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <button className="carousel-btn left" onClick={() => paginate(-1)}>
        ‹
      </button>
      <button className="carousel-btn right" onClick={() => paginate(1)}>
        ›
      </button>
    </div>
  );
}

export default SideView;
