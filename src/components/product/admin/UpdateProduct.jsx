import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db, storage } from "../../../../firebaseConfig.js";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useParams } from "react-router-dom";

const UpdateProduct = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const alert1 = useRef(null);
    const [alertMessage, setAlertMessage] = useState("");
    const [colorLength, setColorLength] = useState(1);
    const [imagesLength, setImagesLength] = useState(1);
    const [imagePreview, setImagePreview] = useState([]);

    const [categories, setCategories] = useState([]);

    // Dynamic fields for title and description
    const [dynamicDesc, setDynamicDesc] = useState([{ title: "", desc: "" }]);

    useEffect(() => {
        const fetchProduct = async () => {
            const docRef = doc(db, "products", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const productData = docSnap.data();
                setProduct(productData);
                setImagePreview(productData.photo || []);
                setColorLength(productData.color.length);

                // Pre-fill the dynamic description fields
                if (productData.desc) {
                    const descData = productData.desc.map((descObj) => ({
                        title: descObj.title || "",
                        desc: descObj.desc || ""
                    }));
                    setDynamicDesc(descData);
                }
            } else {
                console.log("No such document!");
            }
        };
        fetchProduct();
    }, [id]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const docSnap = await getDoc(doc(db, "admin", "categories"));
                if (docSnap.exists()) {
                    setCategories(docSnap.data().list || []); // Fetch existing categories
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);
    const removeImg = (index) => {
        // Remove the image from the preview
        setImagePreview((prevImages) => prevImages.filter((_, i) => i !== index));
    
        // Remove the corresponding file or URL from the product.photo array
        const updatedPhotos = product.photo.filter((_, i) => i !== index);
        setProduct({ ...product, photo: updatedPhotos });
    };
    

    const handleInputChange = (e) => {
        setProduct({ ...product, [e.target.name]: e.target.value });
        console.log(product);
    };

    const handleCategoryChange = (event) => {
        const { name, options } = event.target;
        const selectedValues = Array.from(options)
            .filter(option => option.selected)
            .map(option => option.value);
        setProduct(prevState => ({
            ...prevState,
            [name]: selectedValues
        }));
    };

    const handleColorChange = (index, value) => {
        const newColors = [...product.color];
        newColors[index] = value;
        setProduct({ ...product, color: newColors });
    };

    const handleFileChange = (e) => {
        e.preventDefault();
        const newFile = e.target.files[0];
        if (!newFile) return;

        // Check if the file already exists in the preview
        const fileExists = imagePreview.some(img => img.name === newFile.name);
        if (fileExists) {
            alert("This image has already been added.");
            return;
        }

        // Update image preview
        const newImagePreview = [...imagePreview, URL.createObjectURL(newFile)];
        setImagePreview(newImagePreview);

        // Add file to product photo array (without duplicates)
        const newProduct = { ...product };
        newProduct.photo.push(newFile);
        setProduct(newProduct);
        console.log("Product after adding file:", newProduct);
    };

    const handleDescChange = (index, field, value) => {
        const newDesc = [...dynamicDesc];
        newDesc[index][field] = value;
        setDynamicDesc(newDesc);
    };

    const handleAddDesc = () => {
        setDynamicDesc([...dynamicDesc, { title: "", desc: "" }]);
    };

    const handleRemoveDesc = (index) => {
        const newDesc = dynamicDesc.filter((_, i) => i !== index);
        setDynamicDesc(newDesc);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let photoURLs = [];
            // Upload each new image
            for (const file of product.photo) {
                if (file instanceof File) {
                    const photoRef = ref(storage, `photos/${file.name}`);
                    await uploadBytes(photoRef, file);
                    const url = await getDownloadURL(photoRef);
                    photoURLs.push(url);
                }
                else{
                    photoURLs.push(file)
                }
            }
            console.log("photo url from product state is ",product.photo);
            console.log("photo url after uploading files are ",photoURLs);
            // Merge existing photo URLs with new ones
            photoURLs = [...photoURLs];
            
            const tmpProduct = { ...product };
            tmpProduct.price = parseInt(tmpProduct.price, 10);
            tmpProduct.photo = []; // Clear photo array before updating
            tmpProduct.desc = dynamicDesc; // Set the dynamic descriptions

            console.log("product url are  ",photoURLs);
            await updateDoc(doc(db, "products", id), {
                ...tmpProduct,
                photo: photoURLs,
            });
            setAlertMessage("Product updated successfully.");
            alert1.current.style.display = "block";
        } catch (error) {
            console.error("Error updating product:", error);
            setAlertMessage("Error updating product.");
            alert1.current.style.display = "block";
        }
        setLoading(false);
    };

    if (!product) return <p>Loading...</p>;

    return (
        <div className="container">
            <div ref={alert1} className="alert alert-success" style={{ display: "none" }}>
                {alertMessage}
            </div>
            <form className="m-3" onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="category" className="form-label">Product Category</label>
                    <select
                        className="form-select"
                        multiple
                        name="category"
                        onChange={handleCategoryChange}
                        value={product.category}
                        id="category"
                    >
                        <option value="" key="none" disabled>Select category</option>
                        {categories.map((category) => (
                            <option value={category} key={category}>{category}</option>
                        ))}
                    </select>
                    <div className="mt-3">
                        <p>Selected Categories:</p>
                        {product.category && product.category.map((category) => (
                            <div key={category}>{category}</div>
                        ))}
                    </div>
                </div>

                        
          {/* ✅ Tags */}
          <div className="mb-3">
            <label className="form-label">Product Tags</label>
            <div className="mb-2">
              { product.tags.map((tag, index) => (
                <span key={index} className="badge bg-secondary me-2 mb-2" style={{ cursor: 'pointer' }}
                  onClick={() => setProduct(prev => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }))}>
                  {tag} &times;
                </span>
              ))}
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Type and press space or enter..."
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  console.log("hi");
                  const tag = e.target.value.trim();
                  if (tag && !product.tags.includes(tag)) {
                    setProduct(prev => ({ ...prev, tags: [...prev.tags, tag] }));
                  }
                  e.target.value = "";
                }
              }}
            />
          </div>
                <div className="mb-3">
                    <label className="form-label">Product Title</label>
                    <input
                        type="text"
                        name="title"
                        value={product.title}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Product Subtitle</label>
                    <input
                        type="text"
                        name="subTitle"
                        value={product.subTitle}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>

                {/* Dynamic Description Fields */}
                <div className="mb-3">
                    <label className="form-label">Product Descriptions</label>
                    {dynamicDesc.map((desc, index) => (
                        <div key={index} className="mb-2">
                            <input
                                type="text"
                                value={desc.title}
                                onChange={(e) => handleDescChange(index, "title", e.target.value)}
                                className="form-control mb-2"
                                placeholder="Title"
                            />
                            <textarea
                                value={desc.desc}
                                onChange={(e) => handleDescChange(index, "desc", e.target.value)}
                                className="form-control"
                                placeholder="Description"
                            />
                            {index > 0 && (
                                <button
                                    type="button"
                                    className="btn btn-danger mt-2"
                                    onClick={() => handleRemoveDesc(index)}
                                >
                                    Remove Description
                                </button>
                            )}
                        </div>
                    ))}
                    <button type="button" className="btn btn-success" onClick={handleAddDesc}>
                        Add Description
                    </button>
                </div>

                <div className="mb-3">
                    <label className="form-label">Product Price</label>
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Product Colors</label>
                    {Array.from({ length: colorLength }).map((_, index) => (
                        <input
                            key={index}
                            type="text"
                            value={product.color[index] || ""}
                            onChange={(e) => handleColorChange(index, e.target.value)}
                            className="form-control mt-2"
                        />
                    ))}
                    <button
                        className="btn btn-primary mt-2"
                        type="button"
                        onClick={() => setColorLength(colorLength + 1)}
                    >
                        Add Color
                    </button>
                </div>

                <div className="mb-3">
                    <label className="form-label">Product Images</label>
                    <div className="row">
                        {imagePreview.map((img, index) => (
                            <div key={index} className="col-12 col-md-2">
                                <div className="d-flex flex-column justify-content-center">
                                    <img
                                        src={img}
                                        alt="Preview"
                                        className="img-thumbnail mt-2"
                                        style={{ height: "200px", width: "300px" }}
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            removeImg(index);
                                        }}
                                        className="btn btn-secondary mb-3 mt-2"
                                    >
                                        Remove Image
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {Array.from({ length: imagesLength }).map((_, index) => (
                        <input
                            key={index}
                            type="file"
                            onChange={handleFileChange}
                            className="form-control mt-2"
                        />
                    ))}
                    <button
                        className="btn btn-primary mt-2"
                        type="button"
                        onClick={() => setImagesLength(imagesLength + 1)}
                    >
                        Add Image
                    </button>
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Updating..." : "Update Product"}
                </button>
            </form>
        </div>
    );
};

export default UpdateProduct;
