import React, { useContext, useState } from "react";
import Footer from "./Footer";
import Navbar from "./Navbar"
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { userContext } from "../context/context";

const Contact = () => {
  const user = useContext(userContext);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    query: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
    // Here you would usually send the form data to a backend or Firebase
    // setFormData({ name: "", phone: "", query: "" });
    try{

     const docRef =  await addDoc(collection(db,"concerns"),formData)
     if(docRef) alert("We will react you out soon.")
      else alert("internal server error, Please try again some time.")

    }catch(err){
      console.log(err);
    }
    

  };

  return (
    <div>
<div class="container mt-5">
    <div class="d-flex  justify-content-end">
      {/* <!--address section --> */}
      <div class="contact-section">
        <h3>We are at</h3>
        <p className="m-0"><strong>Address:</strong> Vill. Gyaspur, Sonipat 131027</p>
        <p className="m-0"><strong>Phone:</strong>+91 8307949189</p>
        <p className="m-0"><strong>Email:</strong> vipulkumar3254gmail.com</p>
        <p className="m-0"><strong>Business Hours:</strong> Mon - Sat, 9 AM - 6 PM</p>
      </div>
    </div>
    {/* form section */}
  </div>
      <div className="contact-container" style={{ padding: "50px 20px" }}>
        <h2 className="text-center mb-4">Contact Us</h2>
        <p className="text-center">
          If you have any questions or concerns, feel free to reach out to us!
        </p>

        <form onSubmit={handleSubmit} style={{ maxWidth: "600px", margin: "0 auto" }}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              Phone Number
            </label>
            <input
              type="text"
              className="form-control"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="query" className="form-label">
              Your Query
            </label>
            <textarea
              className="form-control"
              id="query"
              name="query"
              rows="4"
              value={formData.query}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>

  
    </div>
  );
};

export default Contact;
