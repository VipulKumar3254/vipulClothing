import React, { useEffect } from 'react';
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { userContext } from './components/context/context';
import { filterContext } from './components/context/context';


import Navbar from "./components/necessary/Navbar";
import WebCarousel from "./components/WebCarousel";
import ProductGrid from "./components/ProductGrid";
import Deals from "./components/Deals";
import NewArrivalsBanner from "./components/NewArrivalsBanner";
import NewArrivals from './components/NewArrivals';

import Footer from "./components/necessary/Footer";
import SideView from "./components/SideView";
import SportWear from "./components/SportWear";
import Filter from "./components/product/Filter"
import Sale from "./components/Sale";
import { Nav, NavbarBrand } from 'react-bootstrap';
import About from './components/necessary/About';
import Contact from './components/necessary/Contact';
import ProductDisplay from './components/product/ProductDisplay';
import UploadProduct from './components/product/admin/UploadProduct';
import ProductDesc from './components/product/productDescription/ProductDesc';
import AccountCreation from './components/accounts/CreateAccount';
import Orders from './components/product/admin/Orders';
import UserOrders from './components/accounts/UserOrders';


import TrackOrder from './components/accounts/TrackOrder';
import WishList from './components/accounts/WishList';
import Profile from './components/accounts/Profile';
import Login from './components/accounts/Login';


//  all context imports 
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AdminPanel from './components/product/admin/AdminPanel';
import APLogin from './components/product/admin/APLogin';
import Users from './components/product/admin/Users';
import ProductsWeOffer from './components/product/admin/ProductsWeOffer';
import AddProductsWeOffer from './components/product/admin/AddProductsWeOffer';
import AdminPanelDashboard from './components/product/admin/AdminPanelDashBoard';
import AllProducts from './components/product/admin/AllProducts';
import UpdateProduct from './components/product/admin/UpdateProduct';
import AllDeals from './components/AllDeals';
import Banner from './components/product/productDescription/banners/Banner';
import Categories from './components/product/admin/Categories';
import Links from './components/product/admin/links/Links';
import ManageNewArrivals from './components/product/admin/ManageNewArrivals';
import PrivateRoute from './PrivateRoute';
import AddLink from './components/product/admin/links/AddLink';
import SearchProducts from './components/necessary/SearchProducts';
import PrivacyPolicy from './components/necessary/PrivacyPolicy';
import TermsConditions from './components/necessary/TermsConditions';
import Checkout from './components/product/Checkout';
import AdminPanelLinks from './components/product/admin/AdminPanelLinks';




function App() {
  const [count, setCount] = useState(0);

  const [user, setUser] = useState(null)
  const [orderBy, setOrderBy] = useState("");
  const [lessThan, setLessThan] = useState(0);
  const [filterShow, setFilterShow] = useState(false);


  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {

        setUser(user)
      }
      else {

        setUser(null)
      }

    })
  }, [])



  return (
    <>
      <filterContext.Provider value={{ orderBy: orderBy, setOrderBy: setOrderBy, lessThan: lessThan, setLessThan: setLessThan, filterShow: filterShow, setFilterShow: setFilterShow }}>
        <userContext.Provider value={{ user: user, setUser: setUser }}>




          {/* <React.StrictMode> */}

          <BrowserRouter>
            <Routes>
              <Route path="/" element={<> <Navbar />

                <WebCarousel />  {/*web carousal */}
                {/* <Deals /> */}
                {/* top deals  and side sale banner */}


                <div>
                  <Banner />
                </div>
                <Footer />
              </>} />
              <Route path='/about' element={<><Navbar /> <About /> <Footer /></>} />
              <Route path='/contact' element={<><Navbar /> <Contact /> <Footer /></>} />

              {/* account related routes */}
              <Route path='/profile' element={<><Navbar /> <Profile /> <Footer /></>} />
              <Route path='/createAccount' element={<><Navbar /> <AccountCreation /> <Footer /></>} />
              <Route path='/login' element={<><Navbar /> <Login /> <Footer /></>} />
              <Route path='/orders' element={<><Navbar /> <UserOrders /> <Footer /></>}  ></Route>
              <Route path='/trackOrder' element={<><Navbar /> <TrackOrder /> <Footer /></>}  ></Route>
              <Route path='/wishList' element={<><Navbar /> <WishList /> <Footer /></>}  ></Route>
              <Route path='/newArrivals' element={<><Navbar /> <NewArrivals /> <Footer /></>}  ></Route>
              <Route path='/rs200Products' element={<><Navbar /> <ProductDisplay  search={"200"}  /> <Footer /></>}  ></Route>
              {/* improve rs 200  */}
              <Route path='/privayPolicy' element={<><Navbar /> <PrivacyPolicy /> <Footer /></>}  ></Route>
              <Route path='/termsConditions' element={<><Navbar /> <TermsConditions /> <Footer /></>}  ></Route>




              <Route path='/jeans' element={<>
                <Navbar />
                <div className='d-block d-md-flex flex-lg-row '>

                  <Filter />
                  <ProductDisplay category={"jeans"} />
                </div>
                <Footer />

              </>} />

              <Route path='/allDeals' element={<> <Navbar /> <AllDeals /> <Footer /> </>} />
              <Route path='/tshirts' element={<>
                <Navbar />
                <div className='d-block d-md-flex flex-lg-row'>

                  <Filter />
                  <ProductDisplay category={"tshirts"} />
                </div>
                <Footer />

              </>} />
              <Route path='/shirts' element={<>
                <Navbar />
                <div className='d-block d-md-flex flex-lg-row'>

                  <Filter />
                  <ProductDisplay category={"shirts"} />
                </div>
                <Footer />
              </>} />
              <Route path='/joggers' element={<>
                <Navbar />
                <div className='d-block d-md-flex flex-lg-row'>

                  <Filter />
                  <ProductDisplay category={"joggers"} />
                </div>
                <Footer />
              </>} />
              <Route path='/winterCollection' element={<>
                <Navbar />
                <div className='d-block d-md-flex flex-lg-row '>

                  <Filter />
                  <ProductDisplay category={"winterCollection"} />
                </div>
                <Footer />
              </>} />
              <Route path='/sportsWear' element={<>
                <Navbar />
                <div className='d-block d-md-flex flex-lg-row '>

                  <Filter />
                  <ProductDisplay category={"sportsWear"} />
                </div>
                <Footer />
              </>} />
              <Route path='/search' element={<>
                <Navbar />
                <div className='d-block d-md-flex flex-lg-row '>

                  {/* <Filter /> */}
                  <ProductDisplay category={"sportsWear"} />
                </div>
                <Footer />
              </>} />


              <Route path='/product/productDesc' element={<>
                <Navbar />
                <ProductDesc />
                <Footer />


              </>} />
              <Route path='/product/productDesc/:id' element={<>
                <Navbar />
                <ProductDesc />
                <Footer />


              </>} />

              <Route path='/checkout' element={<>
                <Navbar />
                <Checkout />
                <Footer />
              </>} />

              {/* admin panel endpoints are down  */}

              <Route path='/apLogin' element={<> <Navbar /> <APLogin /> <Footer /></>} />
              <Route path='/adminPanel' element={<> <PrivateRoute>  <AdminPanel /> </PrivateRoute></>} />
              <Route path='/admin/upload' element={<><PrivateRoute> 
                   <div className='row'>
            <div className='col-12 col-md-2 border-end'>
              <AdminPanelLinks/>
            </div>
            <div className='col-12 col-md-10'>
                 <UploadProduct /> 
            </div>
          </div>
                </PrivateRoute></>} />
              <Route path='/admin/orders' element={<> <PrivateRoute>  
                   <div className='row'>
            <div className='col-12 col-md-2 border-end'>
              <AdminPanelLinks/>
            </div>
            <div className='col-12 col-md-10'>
                <Orders />
            </div>
          </div>
                  </PrivateRoute> </>} />
              <Route path='/admin/users' element={<>  <PrivateRoute> 
                   <div className='row'>
            <div className='col-12 col-md-2 border-end'>
              <AdminPanelLinks/>
            </div>
            <div className='col-12 col-md-10'>
                 <Users />
            </div>
          </div>
                 </PrivateRoute> </>} />
              <Route path='/admin/allProducts' element={<> <PrivateRoute> 
                   <div className='row'>
            <div className='col-12 col-md-2 border-end'>
              <AdminPanelLinks/>
            </div>
            <div className='col-12 col-md-10'>
                 <AllProducts />

            </div>
          </div>
                  </PrivateRoute> </>} />
              <Route path='/admin/updateProduct/:id' element={<> <PrivateRoute>
                <div className='row'>
                  <div className='col-12 col-md-2 border-end' >
                    <AdminPanelLinks />
                  </div>
                  <div className='col-12 col-md-10'>
                    <UpdateProduct />
                  </div>
                </div>
                 </PrivateRoute> </>} />


              <Route path='/admin/productsWeOffer' element={<> <PrivateRoute>
                <div className='row'>
                  <div className='col-12 col-md-2 border-end'>
                    <AdminPanelLinks />
                  </div>
                  <div className='col-12 col-md-10'>
                    <ProductsWeOffer />

                  </div>
                </div>
             </PrivateRoute> </>} />
              <Route path='/admin/AddProductsWeOffer' element={<> <PrivateRoute>
                <div className='row'>
                  <div className='col-12 col-md-2 border-end'>
                    <AdminPanelLinks />
                  </div>
                  <div className='col-12 col-md-10'>
                    <AddProductsWeOffer />

                  </div>
                </div>
              </PrivateRoute> </>} />
              <Route path='/admin/categories' element={<> <PrivateRoute>
                <div className='row'>
                  <div className='col-12 col-md-2 border-end'>
                    <AdminPanelLinks />
                  </div>
                  <div className='col-12 col-md-10'>
                    <Categories />

                  </div>
                </div>
             </PrivateRoute> </>} />
              <Route path='/admin/links' element={<>  <PrivateRoute>
                <div className='row'>
                  <div className='col-12 col-md-2 border-end'>
                    <AdminPanelLinks />
                  </div>
                  <div className='col-12 col-md-10'>
                    <Links />
                  </div>
                </div>
               </PrivateRoute>  </>} />
              <Route path='/admin/addLink' element={<>  <PrivateRoute>
                <div className='row'>
                  <div className='col-12 col-md-2 border-end'>
                    <AdminPanelLinks />
                  </div>
                  <div className='col-12 col-md-10'>
                    <AddLink />

                  </div>
                </div>
        </PrivateRoute>  </>} />
              <Route path='/admin/manageNewArrivals' element={<> <PrivateRoute>
                <div className='row'>
                  <div className='col-12 col-md-2 border-end'>
                    <AdminPanelLinks />
                  </div>
                  <div className='col-12 col-md-10'>

                    <ManageNewArrivals />
                  </div>
                </div>
    </PrivateRoute>  </>} />





            </Routes>
          </BrowserRouter>
          {/* </React.StrictMode> */}

        </userContext.Provider>
      </filterContext.Provider>
    </>
  );
}

export default App;
