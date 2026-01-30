import { db } from "@/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";

import Filters from "@/components/Filters";
import ProductCardClient from "@/components/ProductCardClient";
import Link from "next/link";
import { Suspense } from "react";

export const dynamic = "force-dynamic"; // 🔥 always SSR (fresh data)

/* 🔹 Fetch Jeans Products (SSR) */
async function getJeansProducts(filters = {}) {
    console.log("Filters in jeans page:", filters);
    
  const constraints = [
    where("category", "array-contains", "joggers"),
  ];

//   💰 Price filters
  if (filters.minPrice) {
    constraints.push(where("price", ">=", Number(filters.minPrice)));
  }

  if (filters.maxPrice) {
    constraints.push(where("price", "<=", Number(filters.maxPrice)));
  }

//   🔃 Sorting
  if (filters.sort === "price-asc") {
    constraints.push(orderBy("price", "asc"));
  } else if (filters.sort === "price-desc") {
    constraints.push(orderBy("price", "desc"));
  } else if (filters.sort === "newest") {
    constraints.push(orderBy("createdAt", "desc"));
  }

  const q = query(collection(db, "products"), ...constraints);
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

/* 🔹 Page Component (SSR) */
export default async function JeansForMenPage({ searchParams }) {
    console.log('searchParams', await searchParams);
    
  const filters  = {
    sort: await searchParams?.sort || "",
    minPrice: await searchParams?.minPrice || "",
    maxPrice:  await searchParams?.maxPrice || "",
  };

  console.log('filters aare',filters);
  
  const products = await getJeansProducts( await  searchParams);

  return (
    <div className="row">
      {/* Filters */}
      <div className="col-12">
        <Suspense fallback={null}>
          <Filters />
        </Suspense>
      </div>

      {/* Products */}
      <div className="col-12 mt-3 px-1">
        <div className="row g-0 g-md-4">
          {products.length > 0 ? (
            products.map((item) => (
              <div className="col-6 col-md-3" key={item.id}>
                <Link
                  href={`/product/${item.id}`}
                  className="text-decoration-none"
                >
                  <div
                    className="card h-100 border-0 rounded-0"
                    style={{ backgroundColor: "#F7F7F7" }}
                  >
                    <div className="position-relative">
                      <img
                        src={
                          Array.isArray(item.photo)
                            ? item.photo[0]
                            : item.photo
                        }
                        className="card-img-top"
                        alt={item.title}
                      />
                    </div>

                    <div
                      className="mt-1 px-2"
                      style={{ fontFamily: "Jost Variable" }}
                    >
                      <h2 className="fw-normal text-dark text-start title">
                        {item.title}
                      </h2>

                      <p
                        className="text-muted mb-0 text-start"
                        style={{ fontSize: "12px" }}
                      >
                        <span className="badge bg-success">
                          Free delivery
                        </span>{" "}
                        on ₹599+
                      </p>

                      <ProductCardClient
                        id={item.id}
                        product={item}
                      />

                      <p className="fw-medium text-dark fs-6 mb-0 mt-2">
        <div>hiii</div>
                        Rs. {item.price} 
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-12 text-center fs-5">
              No Joggers are available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
