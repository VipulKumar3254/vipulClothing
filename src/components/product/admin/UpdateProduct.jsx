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
    const [imagePreview, setImagePreview] = useState(null);

    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            const docRef = doc(db, "products", id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setProduct(docSnap.data());
                setImagePreview(docSnap.data().photo)
                setColorLength(docSnap.data().color.length)

            } else {
                console.log("No such document!");
            }
        };
        fetchProduct();
    }, [id]);

    
    useEffect(()=>{
        const fetchCategories = async () => {
          try {
            const docSnap = await getDoc(doc(db,"admin","categories"));
            if (docSnap.exists()) {
              setCategories(docSnap.data().list || []); // Fetch existing categories
  
            } else {
              
            }
          } catch (error) {
            console.error("Error fetching categories:", error);
          }
        };
        fetchCategories();
      },[])
    useEffect(() => {
        console.log("Updated imagePreview:", imagePreview);
    }, [imagePreview]);

    const removeImg = (index) => {
        setImagePreview((prevImages) => prevImages.filter((_, i) => i !== index));
        console.log(imagePreview);
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
        console.log(product);
    };

    const handleFileChange = (e) => {
        e.preventDefault();
        const newFile = e.target.files[0];
        if (!newFile) return;

        const newProduct = { ...product };
        const fileexists = newProduct.photo.some((file) => file.name == e.target.files[0].name);
        console.log(fileexists);
        if (fileexists) {
            console.log("file already exists");
            alert("file already exist,Choose another file.");
            return;
        }

        newProduct.photo.push(newFile);
        setProduct(newProduct);
        console.log(product);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            let photoURLs = [];
            for (const file of product.photo) {
                if (file instanceof File) {
                    console.log("a file");
                    const photoRef = ref(storage, `photos/${file.name}`);
                    await uploadBytes(photoRef, file);
                    const url = await getDownloadURL(photoRef);
                    photoURLs.push(url);
                }
                else {
                    "not a file "
                    // photoURLs.push(file);
                }

            }
            photoURLs.push(...imagePreview)
            console.log(photoURLs);
            // return;
            const tmpProduct = { ...product };
            tmpProduct.price= parseInt(tmpProduct.price);
            console.log(tmpProduct);
            tmpProduct.photo = [];
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
                    <label htmlFor="exampleInputEmail1" className="form-label">Product Category</label>
                    {/* <input type="text" name="name" value={product.name} onChange={handleInputChange} className="form-control" /> */}
                    <select className="form-select" multiple name="category" onChange={handleCategoryChange} value={product.category} id="category">
                        <option value="" key="winter" selected >Select category</option>
                        {
                            categories ? categories.map((category) => {
                                return <>
                                    <option value={category} key={category}>{category}</option>

                                </>
                            })
                                : ""}
                    </select>
                    <div className="mt-3">
                        <p>Categories are:</p>
                        <p>{product.category ? product.category.map((category) => {
                            return <> <div>{category}</div></>
                        }) : ""}</p>
                    </div>

                    <p className="mt-1 danger text-danger " style={{ display: 'none' }} >Please Select Category Carefully.</p>
                </div>
                <div className="mb-3">
                    <label className="form-label">Product Title</label>
                    <input type="text" name="title" value={product.title} onChange={handleInputChange} className="form-control" />
                </div>

                <div className="mb-3">
                    <label className="form-label">Product sub-Title</label>
                    <input type="text" name="subTitle" value={product.subTitle} onChange={handleInputChange} className="form-control" />
                </div>

                <div className="mb-3">
                    <label className="form-label">Product Description</label>
                    <textarea name="desc" value={product.desc} onChange={handleInputChange} className="form-control" />
                </div>

                <div className="mb-3">
                    <label className="form-label">Product Price</label>
                    <input type="number" name="price" value={product.price} onChange={handleInputChange} className="form-control" />
                </div>
                <div className="mb-3">
                    <label className="form-label">Product Colors</label>
                    {Array.from({ length: colorLength }).map((_, index) => (
                        <input key={index} type="text" value={product.color[index] || ""} onChange={(e) => handleColorChange(index, e.target.value)} className="form-control mt-2" />
                    ))}
                    <button className="btn btn-primary mt-2" type="button" onClick={() => setColorLength(colorLength + 1)}>Add Color</button>
                </div>
                <div className="mb-3">
                    <p>All Images of Product</p>
                    <div className="row">

                        {
                            imagePreview ? imagePreview.map((img, index) => (
                                <div className=" col-12 col-md-2">

                                    <div key={index} className="d-flex flex-column justify-content-center" >

                                        <img src={img} alt="Preview" className="img-thumbnail mt-2" style={{ height: "200px", width: "300px" }} />
                                        <button onClick={(e) => { e.preventDefault(); removeImg(index) }} className=" btn btn-secondary mb-3 mt-2">Remove Image</button>
                                    </div>
                                </div>

                            )) : 'no images til now '

                        }
                    </div>


                    {Array.from({ length: imagesLength }).map((_, index) => (
                        <input key={index} type="file" onChange={handleFileChange} className="form-control mt-2" />
                        // {imagePreview && <img />}

                    ))}
                    <button className="btn btn-primary mt-2" type="button" onClick={() => setImagesLength(imagesLength + 1)}>Add Image</button>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Updating..." : "Update Product"}
                </button>
            </form>
        </div>
    );
};

export default UpdateProduct;
