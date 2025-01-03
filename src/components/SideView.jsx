import "../css/SideView.css";
import tshirt from "../assets/blackTshirt.png";
function SideView (){
    return (
        <>
       <div className="sideView">
        <div className="p-5">
            
        <h1 className="hi">Summer Sale is live</h1>
        <button className="btn btn-primary">Buy Now</button>
        </div>
        <div className="align-self-end ">

        <img src={tshirt} alt="ji" className="tshirtImg" />
        </div>
       </div>
        </>
    )
}
export default SideView;