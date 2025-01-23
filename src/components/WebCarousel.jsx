import { useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import ExampleCarouselImage from "./CarouselImage";
import img1 from "../assets/img1.jpeg"
import img2 from "../assets/img2.jpeg"
import img3 from "../assets/img3.jpeg"

function WebCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect}>
      <Carousel.Item>
        <ExampleCarouselImage img={img1} />
        <Carousel.Caption>
          <h3>Elevate Your Style</h3>
          <p>Fashion that speaks your personality.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <ExampleCarouselImage img={img2} />
        <Carousel.Caption>
          <h3>Where Fashion Meets Passion</h3>
          <p>From streetwear to high fashion, we got you.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <ExampleCarouselImage img={img3} />
        <Carousel.Caption>
          <h3>Wear the Confidence</h3>
          <p>
          Because confidence starts with what you wear.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default WebCarousel;
