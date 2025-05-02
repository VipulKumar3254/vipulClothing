import { useState } from "react";
import { db } from "../../../../../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function AddLink() {
  const [formData, setFormData] = useState({ name: "", path: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const adminDocRef = collection(db, "admin");
      const linksCollectionRef = collection(adminDocRef, "links", "links");
      await addDoc(linksCollectionRef, formData);
      alert("Link added successfully!");
      setFormData({ name: "", path: "" });
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Error adding link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <form 
        onSubmit={handleSubmit}
        className="flex-column border p-2 rounded col-12 col-md-8"
      >
        <div>
          <label className="block">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded"
            required
          />
        </div>
        <div className="mt-2">
          <label className="block">Path:</label>
          <input
            type="text"
            name="path"
            value={formData.path}
            onChange={handleChange}
            className="w-full p-2 rounded"
            required
          />
        </div>
        <button 
          type="submit" 
          className="mt-2 btn btn-primary px-4 py-2 d-flex align-items-center justify-content-center"
          disabled={loading}
        >
          {loading ? (
            <span 
              className="spinner-border spinner-border-sm me-2" 
              role="status" 
              aria-hidden="true"
            ></span>
          ) : null}
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
