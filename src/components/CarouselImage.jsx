import Img1 from "../assets/img1.jpeg";
import "../css/carouselimage.css"

function CarouselImage({img}) {
  return (
    <>


<div
//  className="ratio ratio-16x9"
 >

      <img
      
      src={img}
      alt="carousel image"
      className="img-fluid carousel-image " 
      style={{ height: "400px", width: "100svw" ,objectFit:"cover" ,}}
      />
      </div>
    </>
  );
}

export default CarouselImage;
