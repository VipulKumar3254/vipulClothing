import sale from "../assets/sale.webp"
import "../css/sale.css";
import { Link, useNavigate } from "react-router-dom";
const Sale = ()=>{
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/rs200Products",{state:"200"}); // Navigate to the products page
  }
    return (
        <>
        <div className="d-flex align-items-center justify-content-md-evenly justify-content-sm-center">
          <div className="text-center">
            <h1 className="text-center f-1">Get any product at 250/- only</h1>
            <button onClick={handleClick} className="btn btn-primary  ">Shop Now</button>
          </div>
          <div>
            <img src={sale} alt="Sale Banner" className="saleBanner" />
          </div>
        </div>
      </>
      
    )
}

export default Sale;