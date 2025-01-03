import React, { useEffect } from 'react'
import { Nav } from 'react-bootstrap'
import contact from "../../assets/profile/contactUs.png"
import orders from "../../assets/profile/orders.png"
import wishList from "../../assets/profile/wishList.png"
import { useState } from 'react'
import Cart from '../product/cart'



function Profile() {
    const [user, setUser] = useState({})
    const [showCart, setShowCart] = useState(false);
    const tempProfileImg= "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

    useEffect(()=>{
        setUser(JSON.parse(localStorage.getItem("user")))
    },[])

    const logout=()=>{
        localStorage.clear();
        window.location.reload();
    }

    const toggleCart = () => {
        setShowCart(!showCart);
      };
  return (
    <>
    <div className="container mt-3"> {/* container start */}
    <div className='  row'>
        <div className='col-lg-1'>
            <img className='img-fluid' src={user?user.profilePhotoUrl:tempProfileImg} alt="" />
            <h4 className='text-center'>{user?user.username:"Hi, there"}</h4>
        </div>
      
    </div>
    </div>  { /* container end */}
   
    <div className="container   "> {/* container start */}
        <div className="row justify-content-center">

      
            <div className='col-lg-3 border rounded m-2'>
                        <div className="row">
                            <div className='col-lg-3'>
                                
                                <img className='img-fluid' src={orders} alt="Orders" />
                            </div>
                                <Nav.Link  className="col-lg-8  fs-2 d-flex align-items-center " href="/orders">Orders</Nav.Link>
                            </div>
                            <div>
                                <p>Track, return, or buy something else</p>
                            </div>
            </div>
       
            <div className='col-lg-3 border rounded m-2'>
                        <div className="row">
                            <div className='col-lg-3'>
                                
                                <img className='img-fluid' src={wishList} alt="Wish list" />
                            </div>
                                <Nav.Link  className="col-lg-8  fs-2 d-flex align-items-center " href="/wishList">WishList</Nav.Link>
                            </div>
                            <div className="">
                                <p>Save items for later for convenience</p>
                            </div>
         
        </div>
            <div className='col-lg-3 border rounded m-2'>
                        <div className="row">
                            <div className='col-lg-3'>
                                
                                <img className='img-fluid' src={contact} alt="contact us" />
                            </div>
                                <Nav.Link  className="col-lg-8  fs-2 d-flex align-items-center " href="/contact">Contact Us</Nav.Link>
                            </div>
                            <div className="">
                                <p>Need help? Don't worry, we are here</p>
                            </div>
            </div>
            <div className='col-lg-3 border rounded m-2'>
                        <div className="row">
                            <div className='col-lg-3'>
                                
                                <img className='img-fluid' src={contact} alt="contact us" />
                            </div>
                                <Nav.Link  className="col-lg-8  fs-2 d-flex align-items-center " onClick={toggleCart} href="#">Cart</Nav.Link>
                            </div>
                            <div className="">
                                <p>Come on! Order, we are waiting</p>
                            </div>
            </div>
            <div className='col-lg-3 border rounded m-2'>
                        <div className="row">
                            <div className='col-lg-3'>
                                
                                <img className='img-fluid' src={contact} alt="contact us" />
                            </div>
                                <Nav.Link  className="col-lg-8  fs-2 d-flex align-items-center " onClick={logout} href="#">Log Out</Nav.Link>
                            </div>
                            <div className="">
                                <p>See you soon, have a nice day</p>
                            </div>
            </div>
            </div>
       
    </div>   { /* container end */}

    {showCart && <Cart toggleCart={toggleCart} />}


    </>
  )
}

export default Profile