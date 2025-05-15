// Updated UploadProduct with dynamic desc, colors, sizes, and images
import { collection, addDoc, getDoc, doc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { db, storage } from "../../../../firebaseConfig.js"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

const UploadProduct = () => {
  const spinner = useRef(null);
  const alert1 = useRef(null);
  const categoryMessage = useRef(null);
  const [alertMessage, setalertMessage] = useState("");
  const [size, setSize] = useState("");
  const [colorLength, setColorLength] = useState(1);
  const [imagesLength, setImagesLength] = useState(1);
  const [descLength, setDescLength] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [product, updateProduct] = useState({
    title: "",
    subTitle: "",
    price: null,
    desc: [{ title: "", desc: "" }],
    photo: [],
    category: [],
    sizes: [],
    color: []
  });

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
    const selectedValues = Array.from(options).filter(option => option.selected).map(option => option.value);
    updateProduct(prevState => ({ ...prevState, [name]: selectedValues }));
    console.log(product);

  };

  const handleDescChange = (index, field, value) => {
    const newDesc = [...product.desc];
    newDesc[index][field] = value;
    updateProduct(prev => ({ ...prev, desc: newDesc }));
    console.log(product);

  };

  const handlearrayChange = (index, value) => {
    const newColors = [...product.color];
    newColors[index] = value;
    updateProduct({ ...product, color: newColors });
    console.log(product);

  };

  const handleSelectChange = (e) => {
    const selectedValues = Array.from(e.target.selectedOptions).map(option => option.value);
    updateProduct({ ...product, sizes: selectedValues });
    console.log(product);
  };

  const handleInputChange = (e) => {
    updateProduct({ ...product, [e.target.name]: e.target.value });
    console.log(product);

  };

  const handleFileChange = (e) => {
    let newFile = e.target.files[0];
    if (!newFile) return;
    let newProduct = { ...product };
    const fileexists = newProduct.photo.some((file) => file.name === newFile.name);
    if (fileexists) {
      alert("file already exists, choose another file.");
      return;
    }
    newProduct.photo.push(newFile);
    updateProduct(newProduct);
    console.log(product);

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!product.title || !product.subTitle || !product.price || !product.desc.length || !product.photo.length || !product.sizes.length || !product.color.length) {
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
        category: product.category
      };
      await addDoc(collection(db, "products"), productData);
      alert1.current.style.display = "block";
      setalertMessage("Product has been uploaded.");
    } catch (error) {
      console.log(error);
      alert1.current.style.display = "block";
      setalertMessage("Error while uploading product.");
    }
    spinner.current.style.display = "none";
  };

  return (
    <>
      <div ref={alert1} style={{ display: "none" }} className="alert alert-success alert-dismissible fade show" role="alert">
        {alertMessage}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      <div className="container">
        <form className="m-3" onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Product Category</label>
            <select className="form-select" multiple name="category" onChange={handleCategoryChange} value={product.category}>
              <option value="" disabled>Select category</option>
              {categories.map(category => <option key={category} value={category}>{category}</option>)}
            </select>
            <p className="text-danger" ref={categoryMessage} style={{ display: 'none' }}>Please Select Category Carefully.</p>
          </div>

          <div className="mb-3">
            <label className="form-label">Product Title</label>
            <input required type="text" name="title" value={product.title} onChange={handleInputChange} className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Product Sub Title</label>
            <input required type="text" name="subTitle" value={product.subTitle} onChange={handleInputChange} className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Product Description</label>
            {product.desc.map((item, index) => (
              <div key={index} className="mb-2">
                <input
                  type="text"
                  placeholder="Section Title"
                  value={item.title}
                  onChange={(e) => handleDescChange(index, 'title', e.target.value)}
                  className="form-control mb-1"
                />
                <textarea
                  placeholder="Section Description"
                  value={item.desc}
                  onChange={(e) => handleDescChange(index, 'desc', e.target.value)}
                  className="form-control"
                />
                {product.desc.length > 1 && (
                  <button type="button" className="btn btn-danger mt-2" onClick={() => {
                    const newDesc = product.desc.filter((_, i) => i !== index);
                    updateProduct(prev => ({ ...prev, desc: newDesc }));
                  }}>Remove</button>
                )}
              </div>
            ))}
            <button className="btn btn-secondary mt-2" type="button" onClick={() => {
              updateProduct(prev => ({ ...prev, desc: [...prev.desc, { title: "", desc: "" }] }));
            }}>Add One More</button>
          </div>

          <div className="mb-3">
            <label className="form-label">Product Price</label>
            <input required type="number" name="price" value={product.price} onChange={handleInputChange} className="form-control" />
          </div>

          <div className="mb-3">
            <label className="form-label">Select Size Type</label>
            <div>
              <button type="button" className="btn btn-primary me-2" onClick={() => setSize("number")}>Numbers</button>
              <button type="button" className="btn btn-primary me-2" onClick={() => setSize("alphabets")}>Alphabets</button>
              <button type="button" className="btn btn-primary" onClick={() => {
                setSize("free");
                updateProduct(prev => ({ ...prev, sizes: ["Free Size"] }));
              }}>Free Size</button>
            </div>
            {size === "number" && (
              <select onChange={handleSelectChange} value={product.sizes} multiple className="form-control mt-2">
                {[28, 30, 32, 34, 36, 38, 40].map(size => <option key={size} value={size}>{size}</option>)}
              </select>
            )}
            {size === "alphabets" && (
              <select onChange={handleSelectChange} value={product.sizes} multiple className="form-control mt-2">
                {["S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"].map(size => <option key={size} value={size}>{size}</option>)}
              </select>
            )}
          </div>

          <div>
            <p>Select Product Color</p>
            <button type="button" className="btn btn-primary me-2" onClick={() => setColorLength(colorLength + 1)}>Add Color</button>
            <button type="button" className="btn btn-danger" onClick={() => {
              setColorLength(Math.max(1, colorLength - 1));
              updateProduct(prev => ({ ...prev, color: prev.color.slice(0, -1) }));
            }}>Remove Last Color</button>
            <div className="mt-3">
              {Array.from({ length: colorLength }).map((_, index) => (
                <input key={index} type="text" className="form-control mb-2" placeholder="#ff0000" value={product.color[index] || ""} onChange={(e) => handlearrayChange(index, e.target.value)} />
              ))}
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label mt-3">Product Photos</label>
            <button type="button" className="btn btn-primary me-2" onClick={() => setImagesLength(imagesLength + 1)}>Add Image</button>
            <button type="button" className="btn btn-danger" onClick={() => {
              setImagesLength(Math.max(1, imagesLength - 1));
              updateProduct(prev => ({ ...prev, photo: prev.photo.slice(0, -1) }));
            }}>Remove Last Image</button>
            {Array.from({ length: imagesLength }).map((_, index) => (
              <input key={index} type="file" onChange={handleFileChange} className="form-control mt-2" />
            ))}
          </div>

          <button type="submit" className="btn btn-success">Submit</button>
        </form>
      </div>

      <div ref={spinner} className="text-center position-absolute top-50 start-50 translate-middle" style={{ display: "none" }}>
        <div className="spinner-border" style={{ height: "5rem", width: "5rem" }} role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    </>
  );
};

export default UploadProduct;
