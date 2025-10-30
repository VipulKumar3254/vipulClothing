"use client"; // ✅ Needed because we use state, refs, effects

import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db, storage } from "@/firebaseConfig"; // ✅ Adjust path for Next.js project
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function UploadProduct() {
  const spinner = useRef(null);
  const alert1 = useRef(null);
  const categoryMessage = useRef(null);

  const [alertMessage, setalertMessage] = useState("");
  const [sizeType, setSizeType] = useState("");
  const [colorLength, setColorLength] = useState(1);
  const [imagesLength, setImagesLength] = useState(1);
  const [categories, setCategories] = useState([]);

  const [product, updateProduct] = useState({
    title: "",
    subTitle: "",
    price: null,
    desc: [{ title: "", desc: "" }],
    photo: [],
    category: [],
    sizes: [],
    color: [],
    tags: [],
    stock: {}, // { color: { size: stockNumber } }
  });

  // ✅ Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const docSnap = await getDoc(doc(db, "admin", "categories"));
        if (docSnap.exists()) {
          setCategories(docSnap.data().list || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (event) => {
    const { name, options } = event.target;
    const selectedValues = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);
    updateProduct((prevState) => ({ ...prevState, [name]: selectedValues }));
  };

  const handleDescChange = (index, field, value) => {
    const newDesc = [...product.desc];
    newDesc[index][field] = value;
    updateProduct((prev) => ({ ...prev, desc: newDesc }));
  };

  const handleColorChange = (index, value) => {
    const newColors = [...product.color];
    newColors[index] = value;
    updateProduct({ ...product, color: newColors });
  };

  const handleSizeChange = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    updateProduct({ ...product, sizes: selectedValues });
  };

  const handleInputChange = (e) => {
    updateProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    let newFile = e.target.files[0];
    if (!newFile) return;
    let newProduct = { ...product };
    const fileexists = newProduct.photo.some(
      (file) => file.name === newFile.name
    );
    if (fileexists) {
      alert("File already exists, choose another file.");
      return;
    }
    newProduct.photo.push(newFile);
    updateProduct(newProduct);
  };

  const handleStockChange = (color, size, value) => {
    updateProduct((prev) => ({
      ...prev,
      stock: {
        ...prev.stock,
        [color]: {
          ...prev.stock[color],
          [size]: Number(value),
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !product.title ||
      !product.subTitle ||
      !product.price ||
      !product.desc.length ||
      !product.photo.length ||
      !product.sizes.length ||
      !product.color.length
    ) {
      alert1.current.style.display = "block";
      setalertMessage("Please fill all the fields.");
      return;
    }
    if (!product.category) {
      categoryMessage.current.style.display = "block";
      return;
    } else {
      categoryMessage.current.style.display = "none";
    }

    spinner.current.style.display = "block";
    try {
      let photoURL = [];
      for (const file of product.photo) {
        const photoRef = ref(storage, `photos/${file.name}`);
        await uploadBytes(photoRef, file);
        photoURL.push(await getDownloadURL(photoRef));
      }

      const productData = {
        title: product.title,
        subTitle: product.subTitle,
        price: parseInt(product.price),
        desc: product.desc,
        sizes: product.sizes,
        color: product.color,
        photo: photoURL,
        category: product.category,
        tags: product.tags,
        stock: product.stock,
      };

      await addDoc(collection(db, "products"), productData);
      alert1.current.style.display = "block";
      setalertMessage("Product has been uploaded.");
    } catch (error) {
      console.error(error);
      alert1.current.style.display = "block";
      setalertMessage("Error while uploading product.");
    }
    spinner.current.style.display = "none";
  };

  return (
    <>
      <h2 className="mt-5 text-center">Add Product</h2>
      {/* Alert */}
      <div
        ref={alert1}
        style={{ display: "none" }}
        className="alert alert-success alert-dismissible fade show"
        role="alert"
      >
        {alertMessage}
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>

      <div className="container">
        <form className="m-3" onSubmit={handleSubmit}>
          {/* Category */}
          <div className="mb-3">
            <label className="form-label">Product Category</label>
            <select
              className="form-select"
              multiple
              name="category"
              onChange={handleCategoryChange}
              value={product.category}
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <p
              className="text-danger"
              ref={categoryMessage}
              style={{ display: "none" }}
            >
              Please Select Category Carefully.
            </p>
          </div>

          {/* Title & Subtitle */}
          <div className="mb-3">
            <label className="form-label">Product Title</label>
            <input
              required
              type="text"
              name="title"
              value={product.title}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Product Sub Title</label>
            <input
              required
              type="text"
              name="subTitle"
              value={product.subTitle}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Product Description</label>
            {product.desc.map((item, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  placeholder="Section Title"
                  value={item.title}
                  onChange={(e) =>
                    handleDescChange(index, "title", e.target.value)
                  }
                  className="form-control mb-1"
                />
                <textarea
                  placeholder="Section Description"
                  value={item.desc}
                  onChange={(e) =>
                    handleDescChange(index, "desc", e.target.value)
                  }
                  className="form-control"
                />
                {product.desc.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger mt-2"
                    onClick={() => {
                      const newDesc = product.desc.filter(
                        (_, i) => i !== index
                      );
                      updateProduct((prev) => ({ ...prev, desc: newDesc }));
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              className="btn btn-secondary mt-2"
              type="button"
              onClick={() => {
                updateProduct((prev) => ({
                  ...prev,
                  desc: [...prev.desc, { title: "", desc: "" }],
                }));
              }}
            >
              Add One More
            </button>
          </div>

          {/* Price */}
          <div className="mb-3">
            <label className="form-label">Product Price</label>
            <input
              required
              type="number"
              name="price"
              value={product.price}
              onChange={handleInputChange}
              className="form-control"
            />
          </div>

          {/* Sizes */}
          <div className="mb-3">
            <label className="form-label">Select Size Type</label>
            <div>
              <button
                type="button"
                className="btn btn-primary me-2"
                onClick={() => setSizeType("number")}
              >
                Numbers
              </button>
              <button
                type="button"
                className="btn btn-primary me-2"
                onClick={() => setSizeType("alphabets")}
              >
                Alphabets
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setSizeType("free");
                  updateProduct((prev) => ({
                    ...prev,
                    sizes: ["Free Size"],
                  }));
                }}
              >
                Free Size
              </button>
            </div>
            {sizeType === "number" && (
              <select
                onChange={handleSizeChange}
                value={product.sizes}
                multiple
                className="form-control mt-2"
              >
                {[28, 30, 32, 34, 36, 38, 40].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            )}
            {sizeType === "alphabets" && (
              <select
                onChange={handleSizeChange}
                value={product.sizes}
                multiple
                className="form-control mt-2"
              >
                {["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"].map(
                  (size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  )
                )}
              </select>
            )}
          </div>

          {/* Colors */}
          <div>
            <p>Select Product Color</p>
            <button
              type="button"
              className="btn btn-primary me-2"
              onClick={() => setColorLength(colorLength + 1)}
            >
              Add Color
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                setColorLength(Math.max(1, colorLength - 1));
                updateProduct((prev) => ({
                  ...prev,
                  color: prev.color.slice(0, -1),
                }));
              }}
            >
              Remove Last Color
            </button>
            <div className="mt-3">
              {Array.from({ length: colorLength }).map((_, index) => (
                <input
                  key={index}
                  type="text"
                  className="form-control mb-2"
                  placeholder="Color name or hex (#ff0000)"
                  value={product.color[index] || ""}
                  onChange={(e) => handleColorChange(index, e.target.value)}
                />
              ))}
            </div>
          </div>

          {/* Stock */}
          {product.color.length > 0 && product.sizes.length > 0 && (
            <div className="mt-3">
              <h5>Stock Per Size & Color</h5>
              {product.color.map((c) => (
                <div key={c} className="mb-3">
                  <strong>{c}</strong>
                  {product.sizes.map((s) => (
                    <div
                      key={`${c}-${s}`}
                      className="d-flex align-items-center mb-2"
                    >
                      <label className="me-2" style={{ width: "100px" }}>
                        {s}:
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        style={{ width: "100px" }}
                        value={product.stock?.[c]?.[s] || ""}
                        onChange={(e) =>
                          handleStockChange(c, s, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Photos */}
          <div className="mb-3">
            <label className="form-label mt-3">Product Photos</label>
            <button
              type="button"
              className="btn btn-primary me-2"
              onClick={() => setImagesLength(imagesLength + 1)}
            >
              Add Image
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                setImagesLength(Math.max(1, imagesLength - 1));
                updateProduct((prev) => ({
                  ...prev,
                  photo: prev.photo.slice(0, -1),
                }));
              }}
            >
              Remove Last Image
            </button>
            {Array.from({ length: imagesLength }).map((_, index) => (
              <input
                key={index}
                type="file"
                onChange={handleFileChange}
                className="form-control mt-2"
              />
            ))}
          </div>

          {/* Tags */}
          <div className="mb-3">
            <label className="form-label">Product Tags</label>
            <div className="mb-2">
              {product.tags.map((tag, index) => (
                <span
                  key={index}
                  className="badge bg-secondary me-2 mb-2"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    updateProduct((prev) => ({
                      ...prev,
                      tags: prev.tags.filter((_, i) => i !== index),
                    }))
                  }
                >
                  {tag} &times;
                </span>
              ))}
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Type and press space or enter..."
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  const tag = e.target.value.trim();
                  if (tag) {
                    updateProduct((prev) => ({
                      ...prev,
                      tags: prev.tags.includes(tag)
                        ? prev.tags
                        : [...prev.tags, tag],
                    }));
                  }
                  e.target.value = "";
                }
              }}
            />
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-success">
            Submit
          </button>
        </form>
      </div>

      {/* Spinner */}
      <div
        ref={spinner}
        className="text-center position-absolute top-50 start-50 translate-middle"
        style={{ display: "none" }}
      >
        <div
          className="spinner-border"
          style={{ height: "5rem", width: "5rem" }}
          role="status"
        >
          <span className="sr-only"></span>
        </div>
      </div>
    </>
  );
}
