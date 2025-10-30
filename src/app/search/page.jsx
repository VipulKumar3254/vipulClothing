import { db } from "@/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import "@/styles/productDisplay.css";
import Link from "next/link";
import Filters from "../[productCategory]/Filters";
import ProductCardClient from "../[productCategory]/ProductCardClient";

// 🔹 Unified search function (server-side)
async function getProducts(term) {
  const map = new Map();
  const underMatch = term.match(/under\s+(\d+)/i);
  const aboveMatch = term.match(/above\s+(\d+)/i);
  const price = parseInt(underMatch?.[1] || aboveMatch?.[1]);
  const condition = underMatch ? "<=" : ">=";
  const filteredWords = term
    .replace(/under\s+\d+|above\s+\d+/gi, "")
    .split(/\s+/)
    .filter(Boolean);

  try {
    if (!isNaN(price) && filteredWords.length) {
      const snap = await getDocs(
        query(collection(db, "products"), where("price", condition, price))
      );
      snap.docs.forEach((doc) => {
        const data = doc.data();
        const title = data.title?.toLowerCase() || "";
        const tags = (data.tags || []).map((t) => t.toLowerCase());
        if (
          filteredWords.some((w) => title.includes(w) || tags.includes(w))
        ) {
          map.set(doc.id, { id: doc.id, ...data });
        }
      });
    } else {
      // title search
      const snap = await getDocs(
        query(
          collection(db, "products"),
          where("title", ">=", term),
          where("title", "<=", term + "\uf8ff")
        )
      );
      snap.docs.forEach((doc) =>
        map.set(doc.id, { id: doc.id, ...doc.data() })
      );

      // tag search
      const tagSearches = term.split(/\s+/).map((w) =>
        getDocs(
          query(collection(db, "products"), where("tags", "array-contains", w))
        )
      );
      const results = await Promise.all(tagSearches);
      results.forEach((snap) => {
        snap.docs.forEach((doc) =>
          map.set(doc.id, { id: doc.id, ...doc.data() })
        );
      });

      // exact price match
      const exact = await getDocs(
        query(collection(db, "products"), where("price", "==", parseInt(term)))
      );
      exact.docs.forEach((doc) =>
        map.set(doc.id, { id: doc.id, ...doc.data() })
      );
    }

    return Array.from(map.values());
  } catch (err) {
    console.error("Search error", err);
    return [];
  }
}

// 🔹 Server Component Search Page
export default async function SearchPage({ searchParams }) {
  const term = searchParams?.search || "";
  const products = term ? await getProducts(term.toLowerCase()) : [];

  return (
    <>
      {/* Mobile filter toggle button */}
      <div
        className="mt-1 d-block d-md-none text-center"
        style={{ fontFamily: "Jost Variable" }}
      >
        <div className="btn btn-secondary px-3">Filters</div>
      </div>

      <Filters />

      <div className="container mt-3 px-1">
        <div className="row g-0 g-md-4">
          {products.length > 0 ? (
            products.map((item) => (
              <div className="col-6 col-md-3" key={item.id}>
                <Link
                  href={`/product/${item.id}`}
                  className="text-decoration-none"
                >
                  <div
                    className="card h-100 text-decoration-none rounded-0 border-0"
                    style={{ backgroundColor: "#F7F7F7" }}
                  >
                    <div className="position-relative">
                      <img
                        src={
                          Array.isArray(item.photo) ? item.photo[0] : item.photo
                        }
                        className="card-img-top"
                        alt={item.title}
                      />
                    </div>

                    <div
                      className="card-body mt-1 px-1"
                      style={{ fontFamily: "Jost Variable" }}
                    >
                      <h2
                        className="card-title fw-normal text-dark text-start"
                        style={{ fontSize: "22px" }}
                      >
                        {item.title}
                      </h2>
                      <p
                        className="card-text text-muted p-0 mb-0 text-start"
                        style={{ fontSize: "12px" }}
                      >
                        <span className="badge bg-success text-start">
                          Free delivery
                        </span>{" "}
                        on ₹599+
                      </p>

                      <ProductCardClient id={item.id} product={item} />
                      <p className="fw-medium text-dark fs-6 mb-0 mt-2 ms-0 text-start">
                        Rs. {item.price}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-12 text-center fs-5">
              {term ? "No products found." : "Enter a search term."}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
