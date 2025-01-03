//to do 
// on removing last item fron size and color it is not getting removed from the product object
import { collection, addDoc } from "firebase/firestore"; 
import { useRef, useState } from "react";
import {db,storage} from "../../../firebaseConfig.js"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

const UploadProduct = ()=>{
  const spinner = useRef(null);
  const alert1 = useRef(null);
  const categoryMessage = useRef(null);
  const [alertMessage, setalertMessage] = useState("");
  const [size,setSize] = useState("");
  const [colorLength,setColorLength] = useState(1);
  const [imagesLength, setImagesLength] = useState(1)
  
 
  const [ product,updateProduct ] = useState({
      title:"",
      subTitle:"",
      price:"",
      desc:"",
      photo:[],
      category:"",
      sizes:[],
      color:[]
      
    });

    

    const handlearrayChange = (index,value) => {
      const newColors = [...product.color];
      newColors[index] = value;
      updateProduct({ ...product, color: newColors });

    }
    const handleSelectChange = (e)=>{
      const selectedValues = Array.from(e.target.selectedOptions).map((option) => option.value);
      updateProduct({ ...product, sizes: selectedValues });
      console.log(product);

    }
    const handleInputChange = (e)=>{
      
      console.log(e.target.value);
      updateProduct({ ...product, [e.target.name]:e.target.value})
      console.log(product);
    }
    const handleFileChange = (e)=>{
    let  newFile = e.target.files[0];
      if(!newFile) return;
      // let newProduct = {...product};
      let newProduct = product;
      


      
      const fileexists = newProduct.photo.some((file) => file.name==e.target.files[0].name);
      if(fileexists)
      {
        alert("file already exist,Choose another file.");
        return;
      }

      newProduct.photo.push(newFile);
      updateProduct(newProduct);
      console.log(product);


      // const file = e.target.files[0];
      // let newProduct = product;
      // newProduct.photo.forEach((file) => {
      //   file.name=uuidv4();
      //   console.log(file);
      //   console.log(file.name);
      // })
      // newProduct.photo.push(file);

      // updateProduct(newProduct);

      // let newProduct = product;
      // if(newProduct.photo.length>0){
      //   console.log("having photos inside");

        // newProduct.photo.forEach((file) => {
        // if(file.name==e.target.files[0].name)
        // {
        //   alert("file already exist,Choose another file.");
        //   return;
        // }
        // else{
        //   console.log(e.target.files[0]);
        //   newProduct.photo.push(e.target.files[0]); 
        // }
        // })
     
      // }
      // else{
      //   console.log("not having photos inside");
      //   newProduct.photo.push(e.target.files[0]);
      //   updateProduct(newProduct);
      // }
    }

    const handleSubmit =async (e)=>{
      e.preventDefault();
      if(!product.category)
        {
          categoryMessage.current.style.display="block";
          return;
        }
        else{
          categoryMessage.current.style.display="none";

        }
      spinner.current.style.display="block";
      // uploading photo logic
      if (product.photo) {
        try {
          let photoURL = [];
     for (const file of product.photo) {
          const photoRef = ref(storage, `photos/${file.name}`);
          await uploadBytes(photoRef, file);
          console.log(await getDownloadURL(photoRef));
          // const photoURL = await getDownloadURL(photoRef);
          photoURL.push(await getDownloadURL(photoRef));

          
        }
        console.log(photoURL);
        // return;

            const productData = {
                title: product.title,
                subTitle: product.subTitle,
                price: product.price,
                desc: product.desc,
                sizes: product.sizes,
                color: product.color,

                photo: photoURL,

            };

            await addDoc(collection(db, product.category), productData);
          alert1.current.style.display="block";
            setalertMessage("Product is been uploaded.");
        } catch (error) {
          console.log(error);
          alert1.current.style.display="block";
          setalertMessage("Error while uploading product.");
          
        }
    } else {
        // alert("No photo selected");
        alert1.current.style.display="block";
        setalertMessage("Error while uploading product.");
      // console.log(error);
    }
    spinner.current.style.display="none";


    }
   
    return (
        <>
              <div ref={alert1} style={{display:"none"}} className="alert alert-success alert-dismissible fade show" role="alert">
       {alertMessage}
        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
            <div className="container">

            <form className="m-3" onSubmit={handleSubmit}>
  <div className="mb-3">
    <label htmlFor="exampleInputEmail1" className="form-label">Product Category</label>
    {/* <input type="text" name="name" value={product.name} onChange={handleInputChange} className="form-control" /> */}
    <select className="form-select" name="category" onChange={handleInputChange} value={product.category} id="category">
      <option value="" key="">Select Product Category</option>
      <option value="Jeans" key="jeans">Jeans</option>
      <option value="Tshirt" key="Tshirt">T-Shirt</option>
      <option value="Shirt" key="Shirt">Shirt</option>
      <option value="Jogger" key="Jogger">Jogger</option>
    </select>
    <p className="mt-1 danger text-danger " style={{display:'none'}} ref={categoryMessage}>Please Select Category Carefully.</p>
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
    <textarea required type="text" name="desc" value={product.desc} onChange={handleInputChange} className="form-control" />
  </div>
  <div className="mb-3">
    <label className="form-label">Product Price</label>
    <input required type="number" name="price" value={product.price} onChange={handleInputChange} className="form-control" />
    {/* <input type="color" value={product.color} name="color" onChange={handlearrayChange} /> */}
    {/* <input type="color" value={product.color} name="color" onChange={handlearrayChange} /> */}
  </div>

  
  <div className="mb-3">
    <label className="form-label">Select Size type</label>
    <div>
      <button className="btn btn-primary" onClick={(e)=>setSize("number")}>Numbers</button>
      <button className="btn btn-primary ms-2" onClick={(e)=>setSize("alphabets")}>Alphabets</button>
      <button className="btn btn-primary ms-2" onClick={(e)=>setSize("free")}>Free Size</button>
    </div>
    {size=="number"?
    <div>
      <p>Use Control to select Multiple Sizes</p>
    
  <select onChange={handleSelectChange} value={product.sizes} name="sizes" id="sizes" multiple>
    <option value="28">28</option>
    <option value="30">30</option>
    <option value="32">32</option>
    <option value="34">34</option>
    <option value="36">36</option>
    <option value="38">38</option>
    <option value="40">40</option>
  </select>
    </div>:"" }
    {size=="alphabets"?
     <div>
      <p>Use Control to select Multiple Sizes</p>

     <select  onChange={handleSelectChange} value={product.sizes} name="sizes" id="sizes" multiple>
     <option value="S">S</option>
     <option value="M">M</option>
     <option value="L">L</option>
     <option value="XL">XL</option>
     <option value="XL">2XL</option>
     <option value="XL">2XL</option>
     <option value="XL">3XL</option>
     <option value="XL">4XL</option>
   </select>
     </div>:""}

    {/* <input required type="number" name="price" value={product.price} onChange={handleInputChange} className="form-control" /> */}
  </div>

{/* {
  product.color &&product.color.length>0? 
      product.color.map(()=>{
        return(
          ""
        )
      }) :""
    } */}

<div>
  <p>Select Product Color</p>
  <button className="btn btn-primary" onClick={(e)=>setColorLength(colorLength+1)}>Add Color</button>
  <button className="btn btn-primary ms-2" onClick={(e)=>{setColorLength( colorLength>=2?colorLength-1:colorLength); 
    let newProduct = product;
    newProduct.color.pop();
    updateProduct(newProduct);``
  }}>Remove Last Color</button>
  <div className="mt-3">
    <p>
    Enter Color hexadeciaml values
    </p>
      
    {
      Array.from({length:colorLength}).map((_,index)=>{
        return(
          
            <input type="text" key={index} value={product.color[index] || ""} className=" ms-2"  placeholder="#ff0000" onChange={(e)=>handlearrayChange(index,e.target.value)} name="color" id="" />
         
        )
      })
    }
  </div>


</div>

  
  <div className="mb-3">
    <label className="form-label mt-3">Product Photos</label>
    <div>
    </div>
    <button className="btn btn-primary" onClick={(e)=>setImagesLength(imagesLength+1)}>Add Image</button>
    <button className="btn btn-primary ms-2" onClick={(e)=>{setImagesLength( imagesLength>=2?imagesLength-1:imagesLength);
        let newProduct = product;
        newProduct.photo.pop();
        updateProduct(newProduct);
    }}>Remove Last Image</button>
      {
        Array.from({length:imagesLength}).map((_,index)=>{
          return(
            <input required type="file" key={index}  name="photo" onChange={handleFileChange} className="form-control mt-2" />
          )
        })
      }
  </div>
  
  <button type="submit" className="btn btn-primary">Submit</button>
  
</form>
            </div>

            <div  ref={spinner}  className="text-center " style={{height:"" ,width:"100vw", display:"none"}}>
              <div className="position-absolute top-50 start-50 translate-middle">


            <div className="spinner-border "  style= { { height:"5rem" , width:"5rem"}}role="status">
  <span className="sr-only"></span>
            </div>
              </div>
</div>




        </>
    )
}


export default UploadProduct;