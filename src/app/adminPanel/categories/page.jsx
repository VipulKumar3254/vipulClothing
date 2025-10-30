"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig"; // Adjust import based on your folder structure
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const categoriesDocRef = doc(db, "admin", "categories");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const docSnap = await getDoc(categoriesDocRef);
      if (docSnap.exists()) {
        setCategories(docSnap.data().list || []);
      } else {
        console.log("No categories found, creating new document...");
        await setDoc(categoriesDocRef, { list: [] });
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const updatedCategories = [...categories, newCategory.trim()];
      await updateDoc(categoriesDocRef, { list: updatedCategories });
      setNewCategory("");
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const deleteCategory = async (categoryToDelete) => {
    if (!confirm(`Are you sure you want to delete "${categoryToDelete}"?`)) return;
    try {
      const updatedCategories = categories.filter((category) => category !== categoryToDelete);
      await updateDoc(categoriesDocRef, { list: updatedCategories });
      setCategories(updatedCategories);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Categories</h2>

      <div className="my-3 d-flex">
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
          <li
            key={index}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {category}
            <button
              className="btn btn-danger btn-sm"
              onClick={() => deleteCategory(category)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
