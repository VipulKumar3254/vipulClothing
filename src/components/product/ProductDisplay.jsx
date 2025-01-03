import { useState } from "react";
import {db } from "../../../firebaseConfig";
import { collection, query, where, getDocs } from "firebase/firestore";
import dummy from "../../assets/dummy.png";
import "../../css/ProductDisplay.css"
import { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";

const ProductDisplay= ({category})=>{
    console.log(category);
    const [products, setProducts] = useState([]); const [data, setData] = useState([]);
        useEffect(()=>{
            const fetchData = async ()=>{
                try{
                    const q = query(collection(db,category));
                    const querySnapshot= await getDocs(q);
                    console.log(querySnapshot);
                    const productarray = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                    setProducts(productarray);
                } catch(e)
                {
                    console.log(e);

                }
            }
            fetchData();
        },[])
    return (
        <>
       
        <div className="p-3 gridMaker ">
          
          {products.map(item=>(
           
             <NavLink to="/product/productDesc"   state={[item.id,category]}  className="border m-1 " id={item.id} onClick={()=>{}}>
             <img src={item.photo} height={'300'} className="mx-auto d-block" alt="picture of garment" />
             <div className="d-flex flex-column align-items-center ">
             <p>{item.title}</p>
             <p>{item.subTitle}</p>
             </div>
             <div className="d-flex justify-content-between px-3" >
             <p>&#8377; {item.price}/-</p>
             {/* <p>{item.rating}</p> */}
             </div>
         </NavLink>
          ))}
          
            
        </div>
        </>

    )
}

export default ProductDisplay;