import "@fontsource/roboto"

import React from "react"
import { Link, useNavigate } from "react-router-dom"
import dashboardPng from "../../../assets/dashboardPng.png"

const AdminPanelLinks = () => {
    const navigate = useNavigate();
    return (
        <>
            {/* Action Buttons */}
            <div className="  ms-3 container-fluid d-flex  justify-content-start align-items-center mt-4 ">
                <div className="text-center ">
                    <div className="d-flex  align-items-center btn" onClick={() => { navigate("/adminPanel") }}>
                        <div className="bg-primary-subtle border p-1  ">


                            {/* <SpaceDashboardOutlinedIcon className="p-1 " style={{ height: "45px", width: "45px" }} /> */}
                            <img src={dashboardPng} alt="" style={{ height: "24px" }} className="img-fluid" />
                        </div>
                        <p className="fw-bold fs-4 p-0 m-0 ms-2">
                            Dashboard </p>
                    </div>
                    <div style={{ fontFamily: "roboto" }} className=" d-flex mt-2 justify-content-center gap-3 flex-column flex-md-column">
                        <Link to="/admin/upload" style={{ fontSize: "19px" }} className="fw-semibold btn btn-dark-subtle mb-2">Add Product</Link>
                        <Link to="/admin/allProducts" style={{ fontSize: "19px" }} className="fw-semibold btn btn-dark-subtle mb-2">All Products</Link>
                        <Link to="/admin/orders" style={{ fontSize: "19px" }} className="fw-semibold btn   text-dark mb-2">All Orders</Link>
                        <button style={{ fontSize: "19px" }} className="fw-semibold btn btn-dark-subtle mb-2">User Queries</button>
                        <Link to="/admin/users" style={{ fontSize: "19px" }} className=" fw-semibold btn btn-dark-subtle mb-2">Customers</Link>
                        <Link to="/admin/categories" style={{ fontSize: "19px" }} className=" fw-semibold btn btn-dark-subtle mb-2">Categories</Link>
                        <Link to="/admin/manageNewArrivals" style={{ fontSize: "19px" }} className="btn fw-semibold btn-dark-subtle mb-2">New Arrivals</Link>
                        <Link to="/admin/links" style={{ fontSize: "19px" }} className="fw-semibold btn btn-dark-subtle mb-2">Navigation Links</Link>
                        <Link to="/admin/productsWeOffer" style={{ fontSize: "19px" }} className="fw-semibold btn btn-dark-subtle mb-2">Products We Offer</Link>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AdminPanelLinks;