"use client";

import "@fontsource-variable/jost";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import bannerImg from "@/../public/200Product.webp"; // Place image inside public folder

import "@/styles/sale.css";

const HeroSection = () => {
  const router = useRouter();

  return (
    <div className="bgDiv d-flex align-items-center">
      <div className="container mx-0">
        <div className="row align-items-center">
          <div className="col-md-6">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="padding rounded-4"
            >
              <motion.h2
                style={{ fontFamily: "Jost Variable" }}
                className="title2 mb-3 fw-normal text-shadow1"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Get any Product at 250/- only
              </motion.h2>

              <motion.p
                style={{ fontFamily: "Jost Variable", wordSpacing: "3px" }}
                className="fs subTitle2 mb-4 text-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Don’t miss the chance to upgrade your wardrobe with our
                affordable premium collection. Lorem ipsum dolor sit amet
                consectetur adipisicing elit. A, tempora. Lorem ipsum dolor sit
                amet.{" "}
                <span className="d-md-none">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Ad
                  alias voluptatibus hic minus omnis in, earum distinctio
                  aspernatur quos labore delectus rerum dolore quae dolor eos
                  voluptate fugit dolorem vitae!
                </span>
              </motion.p>

              <motion.div
                className="btn1"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                whileHover={{ scale: 1.1 }}
              >
                <button
                  className="fw-normal rounded-0 btn btn-dark"
                  onClick={() => router.push("/rs200Products")}
                >
                  Shop Now
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* Image Section */}
          <div className="col-md-6 d-none d-md-block text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Image
                src={bannerImg}
                alt="Hero Banner"
                className="img-fluid"
                priority
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
