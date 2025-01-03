import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useState } from 'react'; // Import useState hook
import jeans from "../assets/jeans.jpg";
import polo from "../assets/polo.webp";
import shirt from "../assets/shirt.jpg";
import jogger from "../assets/jogger.jpg";
// css file 
import "../css/Deals.css"
import SideView from './SideView';

let srcs = [polo, shirt, jogger,jeans];

function ProductGrid() {
  const [hoveredIndex, setHoveredIndex] = useState(null); // State to track hovered index

  return (
    <>
    <div style={{background:"#F5F5F5"}} className='d-md-flex d-sm-block  p-3 '>

    <div className='mainContainer' >

    <div className=' d-flex justify-content-center align-items-center'>

<h3 className=' mt-1 ms-2'>Today's Deals</h3>
<p className='ms-3 pt-3'>See all deals</p>
</div>


   
      <div md={5} className="mt-1  deals  row ">
        {srcs.map((src, idx) => (
          <div key={idx}  className='w-50 p-0'>
            <div className=''
              onMouseEnter={() => setHoveredIndex(idx)} // Set hovered index on mouse enter
              onMouseLeave={() => setHoveredIndex(null)} // Reset hovered index on mouse leave
            
              >
              <img className='w-100'
              
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
        <SideView/>
    </div>
    </>
  );
}

export default ProductGrid;
