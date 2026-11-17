import Link from "next/link";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import StoreProductTile from "./StoreProductTile";
import CatalogSortControl from "./CatalogSortControl";

export default async function StoreCatalog({ title, category, maxPrice, searchParams }) {
  const params = await searchParams;
  const constraints = category ? [where("category", "array-contains", category)] : [];
  if (maxPrice) constraints.push(where("price", "<=", Number(maxPrice)));
  if (params?.minPrice) constraints.push(where("price", ">=", Number(params.minPrice)));
  if (params?.maxPrice) constraints.push(where("price", "<=", Number(params.maxPrice)));
  if (params?.sort === "price-asc") constraints.push(orderBy("price", "asc"));
  else if (params?.sort === "price-desc") constraints.push(orderBy("price", "desc"));
  else if (params?.sort === "newest") constraints.push(orderBy("createdAt", "desc"));

  let products = [];
  try {
    const snapshot = await getDocs(query(collection(db, "products"), ...constraints));
    products = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error(`Unable to load ${title} catalog`, error);
  }

  return <main className="store-catalog">
    <div className="store-breadcrumb"><Link href="/">Home</Link> / {title}</div>
    <div className="store-catalog-heading"><div><span className="store-eyebrow">KUMAR FASHION STORE</span><h1>{title}</h1></div><p>Everyday style, selected for you.</p></div>
    <CatalogSortControl count={products.length} sort={params?.sort || ""} />
    {products.length ? <div className="store-catalog-grid">{products.map((product,index)=><StoreProductTile key={product.id} product={product} index={index}/>)}</div> : <p className="store-empty">There are no {title.toLowerCase()} to show right now. Explore <Link href="/newArrivals">new arrivals</Link>.</p>}
  </main>;
}
