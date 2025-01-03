import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useState } from 'react'; // Import useState hook
import jeans from "../assets/jeans.jpg";
import polo from "../assets/polo.webp";
import shirt from "../assets/shirt.jpg";
import jogger from "../assets/jogger.jpg";
// css file 
import "../css/ProductGrid.css";

let srcs = [jeans, polo, shirt, jogger,jeans,jeans,jeans];

function ProductGrid() {
  const [hoveredIndex, setHoveredIndex] = useState(null); // State to track hovered index

  return (
    <>
    <div className=''>

      <h1 className='text-center mt-3'>Products we offer</h1>
      <div md={6} className="mt-1  productRow">
        {srcs.map((src, idx) => (
          <div key={idx}  className=''>
            <div style={{margin:"12px"}}className='border border-0 '
              onMouseEnter={() => setHoveredIndex(idx)} // Set hovered index on mouse enter
              onMouseLeave={() => setHoveredIndex(null)} // Reset hovered index on mouse leave
              >
              <img className='cardImg'
              
                src={src}
                style={{
                  // Add transition for smoother effect
                  transform: hoveredIndex === idx ? "scale(1.1)" : "scale(1)",
                  zIndex:hoveredIndex===idx? "1": "0"
                }}
                />
              <p className='text-center mt-1 '>
              Jeans
                
              </p>
            </div>
          </div>
        ))}
      </div>
        </div>
    </>
  );
}

export default ProductGrid;
