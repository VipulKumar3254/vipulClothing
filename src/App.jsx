import React from 'react';
import { useState } from "react";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import { UserContext } from './components/accounts/User';


import Navbar from "./components/Navbar";
import WebCarousel from "./components/WebCarousel";
import ProductGrid from "./components/ProductGrid";
import Deals from "./components/Deals";
import NewArrivals from "./components/NewArrivals";
import Footer from "./components/Footer";
import SideView from "./components/SideView";
import SportWear from "./components/SportWear";
import Filter from "./components/product/Filter"
import Sale from "./components/Sale";
import { Nav, NavbarBrand } from 'react-bootstrap';
import About from './components/necessary/About';
import Contact from './components/necessary/Contact';
import ProductDisplay from './components/product/ProductDisplay';
import UploadProduct from './components/product/UploadProduct';
import ProductDesc from './components/product/productDescription/ProductDesc';
import AccountCreation from './components/accounts/CreateAccount';
import Orders from './components/accounts/Orders';
import TrackOrder from './components/accounts/TrackOrder';
import WishList from './components/accounts/WishList';
import Profile from './components/accounts/Profile';
import Login from './components/accounts/Login';





function App() {
  const [count, setCount] = useState(0);

  const [user, setUser] = useState(null)


  return (
    <>
    <UserContext.Provider value={{user,setUser}}>

  

    <React.StrictMode>

      <BrowserRouter>
      <Routes>
        <Route path="/" element={ <> <Navbar /> <WebCarousel /> <ProductGrid />
                    <div>
                    <Deals/> 

                    </div>
                    <SportWear/>
                    <NewArrivals/> 
                    <Sale/>

                    <Footer/>
                      </>} />
        <Route path='/about' element={ <><Navbar/> <About/></>}  />
        <Route path='/contact' element={ <><Navbar/> <Contact/></>}  />

        {/* account related routes */}
        <Route path='profile' element={ <><Navbar/> <Profile/> <Footer/></>}  />
        <Route path='/createAccount' element={ <><Navbar/> <AccountCreation/> <Footer/></>}  />
        <Route path='login' element={ <><Navbar/> <Login/> <Footer/></>}  />
        <Route path='/orders' element={ <><Navbar/> <Orders/> <Footer/></>}  ></Route>
        <Route path='/trackOrder' element={ <><Navbar/> <TrackOrder/> <Footer/></>}  ></Route>
        <Route path='/wishList' element={ <><Navbar/> <WishList/> <Footer/></>}  ></Route>



        
        <Route path='/jeans' element={ <>
                    <Navbar/>
                    <div className='d-flex '>

                    <Filter  />
                    <ProductDisplay category={"Jeans"}/>
                    </div>

                  </>}/>
        <Route path='/tshirt' element={ <>
                    <Navbar/>
                    <div className='d-flex '>

                    <Filter  />
                    <ProductDisplay category={"Tshirt"}/>
                    </div>

                  </>}/>
        <Route path='/shirt' element={ <>
                    <Navbar/>
                    <div className='d-flex '>

                    <Filter  />
                    <ProductDisplay category={"Shirt"}/>
                    </div>

                  </>}/>
        <Route path='/joggers' element={ <>
                    <Navbar/>
                    <div className='d-flex '>

                    <Filter  />
                    <ProductDisplay category={"Jogger"}/>
                    </div>

                  </>}/>
        <Route path='/product/productDesc' element={ <>
                    <Navbar/>
                    <ProductDesc/>
                    <Footer/>
                                       

                  </>}/>

      

      {/* admin panel endpoints are down  */}


        <Route path='/admin/upload' element={ <> <Navbar/> <UploadProduct/> <Footer/></>} />
      


      </Routes>
      </BrowserRouter>
    </React.StrictMode>
    
    </UserContext.Provider>
    </>
  );
}

export default App;
