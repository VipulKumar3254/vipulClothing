import React from 'react'
import "../../css/account.css";
import Nav from "react-bootstrap/Nav";
import { useContext,useEffect,useState } from 'react';
import { UserContext } from './User.jsx';

export default function Account({toggleAccount}) {
    const [uid, setUid] = React.useState('');
    useEffect(() => {
   console.log("running useEffect");
        if(localStorage.getItem("uid"))
        {
            setUid(localStorage.getItem("uid"));
        }
    },[])
    
    const User = useContext(UserContext);
    console.log(User);
   
  return (
    
        <div id='mainContainer' className="">
           {uid?<>
            <div className=" col-lg-12 col-sm-12  mb-1 ">
                <div className="row mt-1 justify-content-center">
                    <div className="col-5  text-center  fs-5 border borde-secondary px-4 py-3 m-1 " >
                        {/* Profile */}
                      <  Nav.Link href="/profile">Profile</Nav.Link>
                        </div>
                    <div className="col-5  text-center fs-5 border borde-secondary px-4  py-3 m-1 ">
                        <Nav.Link href='/orders'>Orders</Nav.Link>
                        </div>
                    <div className="col-5  text-center  fs-5 border borde-secondary px-4 py-3 m-1 " >
                        {/* Profile */}
                      <  Nav.Link href="/wishList">WishList</Nav.Link>
                        </div>
                    <div className="col-5  text-center fs-5 border borde-secondary px-4  py-3 m-1 ">
                        <Nav.Link href='/trackOrder'>Track Order</Nav.Link>
                        </div>
                </div>
               

                {/* create account and login */}
                {/* have to show only when user is not logged in and hide then when user is logged in and dont show other options of this component. */}
              
            </div> 

           </>:
           <>
            {/* user is available. */}
          
            <div className='col-lg-12 '>
            
            <div className="row text-center  "   >
                     <div className="col-lg-12 mt-2">
                         <Nav.Link className='px-5 fs-5 py-2 border rounded ' href="/createAccount">Create Account</Nav.Link>
 
                     </div>
                     <div className="col-lg-12 mt-2">
                         <Nav.Link className='px-5 fs-5 py-2 border rounded ' href="/login">Login</Nav.Link>
                     </div>
                 </div>
            </div>
           </>
           }
          
            <div id='closeBtn' className=' text-center d-sm-none'>
            <button type="button" onClick={toggleAccount} className="btn-close fs-1" aria-label="Close"></button>
            </div>


        </div>
  )

}
