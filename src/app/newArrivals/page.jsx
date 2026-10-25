"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import StoreProductTile from "@/components/store/StoreProductTile";

export default function NewArrivals() {
  const [products,setProducts]=useState([]);
  const [loading,setLoading]=useState(true);
  useEffect(()=>{let active=true;(async()=>{try{const result=await getDocs(query(collection(db,"products"),where("isNewArrival","==",true)));if(active)setProducts(result.docs.map(d=>({id:d.id,...d.data()})));}catch(error){console.error("Could not load new arrivals",error);}finally{if(active)setLoading(false);}})();return()=>{active=false}},[]);
  return <main className="store-catalog store-arrivals-page"><div className="store-breadcrumb"><a href="/">Home</a> / New arrivals</div><div className="store-catalog-heading"><div><span className="store-eyebrow">JUST LANDED</span><h1>New arrivals</h1></div><p>Fresh finds for your everyday.</p></div>{loading?<div className="store-empty">A fresh collection is on its way…</div>:products.length?<div className="store-catalog-grid">{products.map((product,index)=><StoreProductTile key={product.id} product={product} index={index}/>)}</div>:<p className="store-empty">No new arrivals at the moment. Explore our <a href="/jeans-for-men">everyday collection</a>.</p>}</main>;
}
