import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { useEffect, useState } from 'react'; // Import useState hook
// css file 
import "../css/ProductGrid.css";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';



function ProductGrid() {
  const [products ,setProducts] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null); // State to track hovered index
  const navigate = useNavigate();
  
  useEffect(()=>{
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "admin", "productsWeOffer", "products"));
        const productsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProducts(productsArray);
        console.log(productsArray);
      } catch (error) {
        console.error("Error fetching products: ", error);
      }
    };

    fetchProducts();
    console.log("products are ",products);
  },[])


  return (
    <>
    <div className=''>

      <h1 className='text-center mt-3'>Products we offer</h1>
      <div md={6} className="mt-1  productRow">
        { products.length>0 ? products.map((product, idx) => (
          <div key={idx}  className='' onClick={()=>{
            navigate(`${product.path}`)
          }}>
            <div style={{margin:"12px"}}className='border border-0 '
              onMouseEnter={() => setHoveredIndex(idx)} // Set hovered index on mouse enter
              onMouseLeave={() => setHoveredIndex(null)} // Reset hovered index on mouse leave
              >
              <img className='cardImg'
              
                src={product.imgSrc}
                style={{
                  // Add transition for smoother effect
                  transform: hoveredIndex === idx ? "scale(1.1)" : "scale(1)",
                  zIndex:hoveredIndex===idx? "1": "0"
                }}
                />
              <p className='text-center mt-1 '>
              {product.name}
                
              </p>
            </div>
          </div>
        )):""}
      </div>
        </div>
    </>
  );
}

export default ProductGrid;
