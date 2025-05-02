import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
// import "../css/sale.cs s"
import { Link } from 'react-router-dom';

function NewArrivalsBanner() {
  return (
    <>
    <div style={{ backgroundColor:"#F5F5F5", padding:"46px 0px"}} className='' >

    <div  className='  container d-flex flex-sm-column flex-md-row  justify-content-around align-items-center mt-5 mb-5'>

    <Card style={{ width: '24rem', maxHeight:"16em" }} className='border border-black border-2 '>
    
    
     
        <div className='d-flex  flex-column justify-content-center align-items-center my-md-5 my-sm-3'>
        <p className=' f-1 '>Discover New</p>
        <p className='f-1' >Arrivals</p>
        </div>
     
   
    </Card>
    {/* <button  type="button" className=" px-5 px-sm-2 py-2 btn btn-dark ">Shop Now</button> */}
              <Link to={"/newArrivals"}
             className=" px-5 px-sm-2 py-2 btn btn-dark ">Shop Now</Link>
    
    </div>
    </div>
    </>
  );
}

export default NewArrivalsBanner;