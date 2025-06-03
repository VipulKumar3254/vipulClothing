import { useState, useEffect } from "react";
import img1 from "../assets/carousel1.png"; // Mobile version
import img1mobile from "../assets/carousel1mobile.png"; // Desktop version of img1
import img2 from "../assets/carousel2.png"; // Mobile version
import img2mobile from "../assets/carousel2mobile.png"; // Desktop version of img3
import "../css/webCarousel.css";

function WebCarousel() {
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const updateIsMobile = () => {
      const mobile = window.innerWidth <= 576;
      setIsMobile(mobile);
      setImages([
        { src: mobile ? img1mobile : img1,   },
        { src: mobile ? img2mobile : img2,  },
      ]);
    };

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);
    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="web-carousel d-flex align-items-center justify-content-center">
      {images.map((img, i) => (
        <div
          key={i}
          className="carousel-slide position-absolute w-100 h-100"
          style={{ opacity: i === index ? 1 : 0, transition: 'opacity 1s ease-in-out' }}
        >
          <img src={img.src} alt={`Slide ${i}`} className="w-100 h-100 object-fit-cover" />
          <div className="position-absolute bottom-0 w-100 text-center text-white p-3 bg-opacity-50">
            <h3 className="fw-bold">{img.title}</h3>
            <p className="mb-0">{img.text}</p>
          </div>
        </div>
      ))}
      <button
        className="position-absolute start-0 top-50 translate-middle-y btn btn-dark btn-sm"
        onClick={() => setIndex((index - 1 + images.length) % images.length)}
      >
        ◀
      </button>
      <button
        className="position-absolute end-0 top-50 translate-middle-y btn btn-dark btn-sm"
        onClick={() => setIndex((index + 1) % images.length)}
      >
        ▶
      </button>
    </div>
  );
}

export default WebCarousel;
