"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "@/styles/WebCarousel.module.css";

function WebCarousel() {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const updateIsMobile = () => {
      const mobile = window.innerWidth <= 576;
      setIsMobile(mobile);

      setImages([
        mobile ? "/carousel1mobile.webp" : "/carousel1.webp",
        mobile ? "/carousel2mobile.webp" : "/carousel2.webp",
      ]);
    };

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 4000);

      return () => clearInterval(interval);
    }
  }, [images]);

  return (
    <>
      {/* Desktop Carousel */}
      <div
        className={`${styles.webCarousel} d-md-flex align-items-center justify-content-center d-none`}
      >
        {images.map((src, i) => (
          <div
            key={i}
            className={`${styles.carouselSlide} position-absolute w-100 h-100`}
            style={{
              opacity: i === index ? 1 : 0,
              transition: "opacity 1s ease-in-out",
            }}
          >
            <Image
              src={src}
              alt={`Slide ${i}`}
              fill
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className={styles.mobileCarousel + " d-sm-block d-md-none"}>
        <Image
          src="/mobilecarousel.webp"
          alt="Mobile Carousel"
          width={1200}
          height={600}
          priority
        />
      </div>
    </>
  );
}

export default WebCarousel;
