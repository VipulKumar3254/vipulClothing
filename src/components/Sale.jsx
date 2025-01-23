import sale from "../assets/sale.png"
import "../css/sale.css";
const Sale = ()=>{
    return (
        <>
        <div className="d-flex align-items-center justify-content-md-evenly justify-content-sm-center">
          <div>
            <h1 className="text-center f-1">Get any product at 200/- only</h1>
          </div>
          <div>
            <img src={sale} alt="Sale Banner" className="saleBanner" />
          </div>
        </div>
      </>
      
    )
}

export default Sale;