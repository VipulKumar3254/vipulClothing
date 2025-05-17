import { useState, useEffect } from "react";
import img1 from "../assets/carousel4.png";
import img3 from "../assets/carousel3.png";
import "../css/webCarousel.css";

const images = [
  { src: img3,
    //  title: "Elevate Your Style", text: "Fashion that speaks your personality." 
    },
  { src: img1,
    //  title: "Where Fashion Meets Passion", text: "From streetwear to high fashion, we got you."
     },

  // { src: img3, title: "Wear the Confidence", text: "Because confidence starts with what you wear." },
];

function WebCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Auto-slide every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="web-carousel d-flex align-items-center justify-content-center">
      {images.map((img, i) => (
        <div
          key={i}
          className="carousel-slide position-absolute w-100 h-100"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <img src={img.src} alt={`Slide ${i}`} />
          <div className="position-absolute bottom-0 w-100 text-center text-white p-3  bg-opacity-50">
            <h3 className="fw-bold">{img.title}</h3>
            <p className="mb-0">{img.text}</p>
          </div>
        </div>
      ))}
      {/* Manual Navigation */}
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
