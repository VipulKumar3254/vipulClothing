import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import newArrival from "../assets/newArrival.png";

export default function NewArrivalsBanner() {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.2 });

  const fadeScaleLeft = (delay = 0) => ({
    hidden: { opacity: 0, x: -40, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut", delay },
    },
  });

  const fadeScaleRight = {
    hidden: { opacity: 0, x: 40, scale: 0.95 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut", delay: 0.3 },
    },
  }

  return (
    <div style={{backgroundColor:"#F7F7F7"}}
      ref={ref}
      className=" mt-2 d-flex flex-column flex-md-row align-items-center justify-content-between px-3 px-md-5 py-5 gap-4"
    >
      {/* Left Text */}
      <div className="w-100 w-md-60 text-center text-md-start">
        <motion.h1
          className="fs-2 fw-bold mb-3"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeScaleLeft(0)}
        >
          Discover New Arrivals
        </motion.h1>

        <motion.p
          className="text-muted mb-4"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeScaleLeft(0.2)}
        >
          Explore our latest drop of premium menswear — curated for confident, everyday fashion. <br />
          Handpicked essentials designed for modern Indian men. <br />
          {/* Elevate your wardrobe with effortless everyday styles.  */}
          {/* Limited stock. Fresh drops updated weekly — don’t miss out! <br /> */}
        </motion.p>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeScaleLeft(0.4)}
        >
          <Link
            to="/newArrivals"
            className="btn btn-dark"
          >
            <motion.div
              whileHover={{
                scale: 1.05,
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
              }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Explore Now →
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {/* Right Image */}
      <motion.div
        className="w-100 w-md-40 d-flex justify-content-center justify-content-md-end"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeScaleRight}
      >
        <motion.img
          src={newArrival}
          alt="Model"
          className="img-fluid rounded shadow"
          // style={{ maxWidth: "300px" }}
          whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}
          transition={{ type: "spring", stiffness: 250 }}
        />
      </motion.div>
    </div>
  );
}
