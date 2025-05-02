import React, { useContext, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";  // Import Bootstrap CSS
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { userContext } from "../../context/context";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import AdminPanelDashboard from "./AdminPanelDashBoard";


const AdminPanel = () => {
    const [isAdmin, setIsAdmin] = useState(null); // State to track admin status
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
          await auth.signOut();
          navigate('/apLogin'); // Redirect to the login page after logout
        } catch (error) {
          console.error('Error logging out: ', error.message);
        }
      };

     

    useEffect(() => {
          const auth= getAuth();
              onAuthStateChanged(auth,async (user)=>{
                const docRef = doc(db,"users",user.uid);
                const docSnap = await getDoc(docRef)
                if(docSnap.exists())
                {
                if(docSnap.data().isAdmin)
                {
                    setIsAdmin(true); 
                   
                }
                }
                else{
                    console.log("no data found")
                }
        
              })
      }, []);


        // If we are still checking admin status, show a loading spinner
   if (isAdmin === null) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  

  // If the user is not an admin, we won't render the admin panel
  if (isAdmin === false) {
    return null; // Redirecting already happens via navigate in useEffect
  }
  return (
    <>
    {/* welcome texts */}
     <div className="container py-4">
      {/* Logout Button */}
      <button
        className="btn btn-danger mb-4"
        onClick={handleLogout}
      >
        Logout
      </button>

      {/* Admin Panel Content */}
      {/* <AdminPanelDashboard/> */}
    </div>
    {/* main action buttons */}
    <div className="container-fluid d-flex justify-content-center align-items-center ">
      <div className="text-center mb-md-3">
        <div className="d-flex   justify-content-center gap-3 flex-column flex-md-column">
          <Link to={"/admin/orders"} className="btn btn-primary mb-3 mb-md-0">All orders</Link>
          <Link to={"/admin/upload"} className="btn btn-primary mb-3 mb-md-0">Add Product</Link>
          <Link to={"/admin/users"} className="btn btn-primary mb-3 mb-md-0">All Users</Link>
          <Link to={"/admin/allProducts"} className="btn btn-primary mb-3 mb-md-0">All Products</Link>
          <Link to={"/admin/productsWeOffer"} className="btn btn-primary mb-3 mb-md-0">Products we offer</Link>
          <Link to={"/admin/categories"} className="btn btn-primary mb-3 mb-md-0">Categories</Link>
          <Link to={"/admin/links"} className="btn btn-primary mb-3 mb-md-0">Links</Link>
          <button className="btn btn-primary mb-3 mb-md-0">Deals</button>
          <Link to={"/admin/manageNewArrivals"} className="btn btn-primary mb-3 mb-md-0">New Arrivals</Link>

          <button className="btn btn-primary mb-3 mb-md-0">200 Rupees Products</button>
          <button className="btn btn-primary mb-3 mb-md-0">Sale</button>
        </div>
      </div>
    </div>
    </>
  );
};

export default AdminPanel;
