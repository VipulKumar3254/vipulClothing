"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import newArrival from "@/../public/newArrival.webp";
import "@fontsource-variable/jost";
import "@/styles/newArrivalsBanner.css";

export default function NewArrivalsBanner() {
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.2 });
  const router = useRouter();

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
  };

  return (
    <div
      style={{ fontFamily: "Jost Variable", backgroundColor: "#F7F7F7" }}
      ref={ref}
      className="d-flex flex-column-reverse flex-md-row align-items-center justify-content-between px-3 px-md-5 py-5 gap-4"
    >
      {/* Left Text */}
      <div className="w-100 w-md-60 text-center text-md-start">
        <motion.h2
          className="fw-normal mb-3 d-md-block d-none"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeScaleLeft(0)}
        >
          Discover New Arrivals
        </motion.h2>

        <motion.p
          style={{ wordSpacing: "3px", fontFamily: "Jost Variable" }}
          className="text-muted subTitle"
          id="subTitle"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeScaleLeft(0.2)}
        >
          Explore our latest drop of premium menswear — curated for confident <br />
          Handpicked essentials designed for modern Indian men. Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit laudantium quas ipsa quae praesentium at architecto consectetur aliquid, perferendis eum voluptatum totam simili
        </motion.p>

        <motion.div
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={fadeScaleLeft(0.4)}
        >
          <motion.button
            style={{ fontFamily: "Jost Variable" }}
            className="btnn"
            id="btnn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/newArrivals")}
          >
            Shop Now
          </motion.button>
        </motion.div>
      </div>

      {/* Right Image */}
      <motion.div
        className="w-100 w-md-40 d-flex justify-content-center justify-content-md-end d-none d-md-block"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeScaleRight}
      >
        <motion.div whileHover={{ scale: 1.05, filter: "brightness(1.1)" }}>
          <Image
            src={newArrival}
            alt="Model"
            className="img-fluid rounded shadow"
            priority
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
