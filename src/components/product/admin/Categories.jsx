import React, { useEffect, useState } from "react";
import { db } from "../../../../firebaseConfig";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");
    const categoriesDocRef = doc(db, "admin", "categories"); // Reference to the document

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const docSnap = await getDoc(categoriesDocRef);
            if (docSnap.exists()) {
                setCategories(docSnap.data().list || []); // Fetch array from document
            } else {
                console.log("No categories document found, creating a new one...");
                await setDoc(categoriesDocRef, { list: [] }); // Create document with empty list
                setCategories([]);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const addCategory = async () => {
        if (!newCategory.trim()) return;
        try {
            const updatedCategories = [...categories, newCategory]; // Add new category to array
            await updateDoc(categoriesDocRef, { list: updatedCategories });
            setNewCategory("");
            setCategories(updatedCategories); // Update state
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };

    const deleteCategory = async (categoryToDelete) => {
        try {
            const updatedCategories = categories.filter(category => category !== categoryToDelete);
            await updateDoc(categoriesDocRef, { list: updatedCategories });
            setCategories(updatedCategories); // Update state
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    return (
        <div className="container mt-4">
            <h2>Categories</h2>
            
            <div className="mb-3 d-flex">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Enter new category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                />
                <button className="btn btn-primary" onClick={addCategory}>
                    Add Category
                </button>
            </div>

            <ul className="list-group mb-2">
                {categories.map((category, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        {category}
                        <button className="btn btn-danger btn-sm" onClick={() => deleteCategory(category)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Categories;
