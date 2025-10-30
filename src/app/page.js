import Deals from "@/components/home/Deals"
import Script from "next/script";
import NewArrivalsBanner from "@/components/home/NewArrivalBanner"
import ProductsHorizontalGrid from "@/components/home/ProductsHorizontalGrid"
import SportsWear from "@/components/home/SportWear"

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"> </link>

import WebCarousel from "@/components/home/WebCarousel"
import Sale from "@/components/home/Rs200Products"
export default function home(){
  const breadcrumbSchema=  {
  "@context": "https://schema.org/", 
  "@type": "BreadcrumbList", 
  "itemListElement": [{
    "@type": "ListItem", 
    "position": 1, 
    "name": "Jeans",
    "item": "https://kumarfashion.in/jeans"  
  },{
    "@type": "ListItem", 
    "position": 2, 
    "name": "Shirts",
    "item": "https://kumarfashion.in/shirts"  
  },{
    "@type": "ListItem", 
    "position": 3, 
    "name": "Joggers",
    "item": "https://kumarfashion.in/joggers"  
  },{
    "@type": "ListItem", 
    "position": 4, 
    "name": "T-Shirts",
    "item": "https://kumarfashion.in/tShirts"  
  }]
}

  return(
    <>
    <WebCarousel/>
    <Deals/>
    <ProductsHorizontalGrid title="Men's Collection" categoryTag="mensCollection"/>
    <ProductsHorizontalGrid title="Summer Collection" categoryTag="summerCollection"/>
    {/* <SportsWear/> */}
    {/* <NewArrivalsBanner/> */}
    <Sale/>

      <Script
        id="breadcrumb-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  )
}