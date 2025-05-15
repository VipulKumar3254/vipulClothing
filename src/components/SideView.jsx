import "../css/SideView.css";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import img1 from "../assets/img7.png";
import img2 from "../assets/img6.png";
import img3 from "../assets/img5.png";

const slides = [
  {
    img: img1,
    title: "Summer Vibes",
    desc: "Light and breezy fits for the season.",
  },
  {
    img: img2,
    title: "Beach Ready",
    desc: "Look great while staying cool.",
  },
  {
    img: img3,
    title: "Street Style",
    desc: "Trendy picks for your daily grind.",
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
            className="carousel-slide row align-items-center mx-auto"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{
              position: "absolute",
              width: "100%",
              maxWidth: "100%",
              margin: 0,
              background: "transparent",
              height: "100%",
            }}
          >
            {/* Text Section */}
            <div className="col-md-4 text-section text-center text-md-start px-4 py-4 d-flex flex-column justify-content-center h-100">
              <motion.h3
                className="fw-bold"
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
              <motion.button
                className="btn btn-dark text-uppercase px-4 mt-3 align-self-md-start align-self-center"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                Buy Now
              </motion.button>
            </div>

            {/* Image Section */}
            <div className="col-md-8 d-flex align-items-center justify-content-center p-4 h-100">
              <motion.img
                src={slides[index].img}
                alt={slides[index].title}
                className="carousel-img img-fluid"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6 }}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <button
          className="carousel-btn left"
          onClick={() => paginate(-1)}
          aria-label="Previous"
        >
          ‹
        </button>
        <button
          className="carousel-btn right"
          onClick={() => paginate(1)}
          aria-label="Next"
        >
          ›
        </button>
      </div>
  
  );
}

export default SideView;
