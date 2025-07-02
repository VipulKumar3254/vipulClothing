import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import newArrival from "../assets/newArrival.png";
import "@fontsource-variable/jost"
import "../css/newArrivalBanner.css"

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
    <div  style={{fontFamily:"Jost Variable",backgroundColor:"#F7F7F7"}}
      ref={ref}
      className="  d-flex flex-column-reverse flex-md-row align-items-center justify-content-between px-3 px-md-5 py-5 gap-4"
    >
      {/* Left Text */}
      <div className="w-100 w-md-60 text-center text-md-start">
        <motion.h2 
          className=" fw-normal mb-3 d-md-block d-none "
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeScaleLeft(0)}
        >
          Discover New Arrivals
        </motion.h2>

        <motion.p
        style={{wordSpacing:"3px" , fontFamily:"Jost Variable"}}
          className="text-muted subTitle "
          initial="hidden" id="subTitle"
          animate={inView ? "visible" : "hidden"}
          variants={fadeScaleLeft(0.2)}
        >
          Explore our latest drop of premium menswear — curated for confident <br />
          Handpicked essentials designed for modern Indian men. Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit laudantium quas ipsa quae praesentium at architecto consectetur aliquid, perferendis eum voluptatum totam simili<br />
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
            className=""
          >
          <motion.button on  style={{fontFamily:"Jost Variable", fontWeight:""} } 
                       className=" btnn " id="btnn"
                       whileHover={{ scale: 1.1 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={() =>navigate("/sportsWear")} 
                     >
                       Shop Now
                     </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Right Image */}
      <motion.div
        className="w-100 w-md-40 d-flex justify-content-center justify-content-md-end d-none d-md-block"
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
