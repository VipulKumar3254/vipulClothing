import "../css/SideView.css";
import tshirt from "../assets/blackTshirt.png";
import { Link } from "react-router-dom";
function SideView (){
    return (
        <>
       <div className="sideView">
        <div className=" p-2 p-md-5">
            
        <h1 className="   hi">Winter Sale is live</h1>
        {/* <button className="btn btn-primary">Buy Now</button> */}
        <Link to="/winterCollection" className="btn btn-primary">Buy Now</Link>
        </div>
        <div className="align-self-end m-0 ">

        <img src={tshirt} alt="sale banner"  className="tshirtImg" />
        </div>
       </div>
        </>
    )
}
export default SideView;