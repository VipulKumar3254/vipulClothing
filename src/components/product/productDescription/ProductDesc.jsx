// this component will show  the detailed description of the product (coming after clicking on the product.)
import { db } from "../../../../firebaseConfig";
import { useLocation } from "react-router-dom";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { getAuth,onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import "../../../css/ProductDesc.css"
//desc banner images
import returnlogo from   "../../../assets/DescBanner/return.png";
import homeDelivery from "../../../assets/DescBanner/homeDelivery.png";
import cod from "../../../assets/DescBanner/cod.png";



// component having multiple nested components. 
const ProductDesc = () => {
    const [purchase, setPurchase] = useState({})
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [user,setUser]=useState({});
// 
    const handleChange= (event)=>{
        console.log("hii ");
        const { name, value } = event.target;
        setPurchase({
            ...purchase,
            [name]: value,
        });
        console.log(purchase);

    }
    const [product ,setProduct]=useState(null)
    const prop = useLocation();
    const category = prop.state[1]

    // *****useEffect to set the user
    useEffect(()=>{
        
        const auth = getAuth();
        onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in, see docs for a list of available properties
            // https://firebase.google.com/docs/reference/js/auth.user
        setUser(user);
            // ...
        } else {
            setUser(null)
            console.log("user not logged in ");
        }
        });

    })
    useEffect(()=>{
        const fetchData= async ()=>{

            try {
              const docRef = doc(db, category, prop.state[0]);
                const docSnap = await getDoc(docRef)  

                if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                console.log(docSnap.id);
                    // setProduct(state=>{return docSnap.data()})
                    
                setProduct({...docSnap.data(),["id"]:docSnap.id});

                // console.log("product is ",product);
                } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
                }

            } catch (e) {
                console.log(e);
            }
        }
        fetchData();

    },[category,prop.state])
    const purchaseSet=()=>{
        let cartItem = purchase;
        cartItem.title=product.title;
        cartItem.price=product.price;
        cartItem.photo=product.photo
        cartItem.id=product.id
        cartItem.userId=user.uid;
        setPurchase(cartItem);
    }
    const addToCart=()=>{
        if(!purchase.size || !purchase.color) { alert("choose size and color");}
        let cart = JSON.parse(localStorage.getItem("cart"))
        console.log(cart)
        if(!cart) cart=[];

    //  to set the purchase object
        purchaseSet();
        
        let existingItem= cart.find( item=>item.size == purchase.size && item.color==purchase.color && item.title==purchase.title );

        if(!existingItem)
        {
            cart.push(cartItem)
        }
        else
        {
            alert("Product already in Cart");
        }
        localStorage.setItem("cart",JSON.stringify(cart))
        alert("Added to Cart");
        console.log(product);
    }
    const buyProduct=async ()=>{
        if(!user) { alert("Please login first to continue"); return;}
        console.log(user);
        if(purchase.size && purchase.color){    
            console.log("buying product");
            purchaseSet();
            const docRef = await addDoc(collection(db,"orders"),{  purchase})
            console.log("purchase done",docRef.id);
    }
    else{   
       alert("choose size and color");

    }
}


    return(
        <>
        <div>
            {product? (
                <>
                <div className="container-fluid">
                    <div className="row position-relative">
                        <div className="col-xl-5   ">
                            <div className="row  ">
                                <div className="col-lg-1">

                                {
                                    product.photo.map((photo,index)=>{
                                        return(
                                            <div  className="mt-2" style={{height:"50px",width:"35px",}}>

                                            <img className="border rounded  " style={{height:"50px",width:"35px",background:"#F7F7F7"}}  src={product.photo[index]} alt="hi" onClick={()=>{ setSelectedImageIndex(index); console.log(selectedImageIndex);}} />
                                            </div>
                                        )
                                    })
                                }
                                </div>
                               <div className="col-lg-6">
                                
                        <img className=" productImg  mx-auto  d-block"  src={product.photo[selectedImageIndex]} alt="" />
                               </div>
                            </div>

                        </div>
                        <div className="col-lg-7 border-start ps-4 ">
                           <p className="text-capitalize fs-3 mt-5 ms-2"  style={{ fontFamily: "Archivo, SansSerif",fontWeight:"500"}}> {product.title}</p>
                           <p className="fs-5 ms-2">{product.subTitle}</p>
                           <p className="fs-4 ms-2" style={{fontWeight:"500"}}><sup style={{fontSize:"13px"}}> &#8377;</sup>{product.price}</p>
                           <div className=" mt-3 text-center d-flex justify-content-start align-items-center">
                            <div className="m-2 mx-3 ">
                                <img style={{height:"30px",}}  className=" m-2 "  src={returnlogo} alt="" />
                                <p className="" style={{fontSize:"12px"}}>10 day return <br /> policy</p>
                            </div>
                            <div className="m-2 mx-3 ">
                                <img style={{height:"30px",}}  className=" m-2 "  src={homeDelivery} alt="" />
                                <p className="" style={{fontSize:"12px"}}>Fast Home<br/> Delivery</p>
                            </div>
                            <div className="m-2 mx-3 ">
                                <img style={{height:"30px",}}  className=" m-2 "  src={cod} alt="" />
                                <p className="" style={{fontSize:"12px"}}>Cash on <br /> Delivery</p>
                            </div>
                           </div>
                           <p className="m-0 mt-1">Size</p>
                           <div>
                            <select className="border rounded" name="size" onChange={handleChange} id="size">
                                <option value="">Select</option>
                               { product.sizes?  product.sizes.map((size)=>{
                                   return(
                                    <option value={size}>{size}</option>
                                   )
                                   
                               }):""}
                            </select>
                           </div>
                             <p className="m-0 mt-3">Color</p>
                           <div className="">
                          
                            {
                            product.color &&product.color.length>0?
                            
                            product.color.map((color)=>{
                                return(
                                    <div className="d-inline text-center">

                                    <input  type="radio" name="color" className="d-none" onChange={handleChange} value={color} id={color} />
                                    <label htmlFor={color} className="">
                                        <img src={product.photo} style={{height:"60px", width:"40px"}} className="border borde-dotted ms-2" alt="" />
                                        <p>{color}</p>  
        
                                    </label>
                                    </div>
                                )
                            })
                            
                           
                            :"hii"}
                            {/* <input type="radio" name="color" onChange={handleChange} value="black" id="color2" /> */}
                            {/* <input type="radio" name="color"  onChange={handleChange} value="pink" id="color3" /> */}
                           </div>

                           <div className="row mt-3  justify-content-start">
                            <div className="col-lg-2 fs-6 text-center text-bg-warning border rounded px-2 py-2 btn " onClick={addToCart} >Add to Cart</div>
                            <div className="col-lg-2 fs-6 text-center text-bg-success ms-2 border rounded px-2 py-2 btn" onClick={buyProduct}> buy Now</div>
                           </div>
                        
                          

                        </div>

                    </div>
                    <div>
                    <hr class="border border-secondary border-1 opacity-50"/>
                    </div>
                            <h2>Product Description</h2>
                    <div className="row mt-4 container mx-auto ">
                        <div className="col-xl-12">
                            <pre style={{ fontFamily: "Noto Sans JP, SansSerif",}} className="fs-6">

                            {product.desc}
                            </pre>
                        </div>
                    </div>
                    
                </div>
                </>

            ):(
                <p>Loading...</p>
            )}
        </div>

        {/* till not extra data is available we are adding some margin from footer */}
        <div style={{marginBottom:"600px"}}></div>
        </>
    )
}

export default ProductDesc; 