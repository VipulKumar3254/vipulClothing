"use client";
import { useState, useEffect } from "react";
import Image from "next/image"; // ✅ Next.js Image
import img1 from "/public/carousel1.webp";
import img1mobile from "/public/carousel1mobile.webp";
import img2 from "/public/carousel2.webp";
import img2mobile from "/public/carousel2mobile.webp";
import mobileCarousel from "/public/mobilecarousel.webp";
import "@/styles/WebCarousel.css";

function WebCarousel() {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [images, setImages] = useState([]);

  // Handle window resizing safely
  useEffect(() => {
    const updateIsMobile = () => {
      const mobile = window.innerWidth <= 576;
      setIsMobile(mobile);
      setImages([
        { src: mobile ? img1mobile : img1 },
        { src: mobile ? img2mobile : img2 },
      ]);
    };

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  // Carousel index rotation
  useEffect(() => {
    if (images.length > 0) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [images]);

  return (
    <>
      <div className="web-carousel d-md-flex align-items-center justify-content-center d-none">
        {images.map((img, i) => (
          <div
            key={i}
            className="carousel-slide position-absolute w-100 h-100"
            style={{
              opacity: i === index ? 1 : 0,
              transition: "opacity 1s ease-in-out",
            }}
          >
            <Image
              src={img.src}
              alt={`Slide ${i}`}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
      <div className="mobileCarousel d-sm-block d-md-none">
        <Image src={mobileCarousel} alt="Mobile Carousel" />
      </div>
    </>
  );
}

export default WebCarousel;
