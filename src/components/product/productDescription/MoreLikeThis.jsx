import "@fontsource/archivo"
import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig"; // Adjust the import based on your file structure 
import "../../../css/MoreLikeThis.css"

const MoreLikeThis = ({ product }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!product) return;

      try {
        const minPrice = product.price * 0.8;
        const maxPrice = product.price * 1.2;

        let q = query(
          collection(db, "products"),
          where("category", "==", product.category),
          where("price", ">=", minPrice),
          where("price", "<=", maxPrice)
        );

        const snapshot = await getDocs(q);
        let results = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(p => p.id !== product.id);

        // Optional: filter by tags
        // if (product.tags?.length) {
        //   const productTagSet = new Set(product.tags.map(tag => tag.toLowerCase()));
        //   results = results.filter(p => {
        //     const pTags = p.tags?.map(tag => tag.toLowerCase()) || [];
        //     return pTags.some(tag => productTagSet.has(tag));
        //   });
        // }

        setRelated(results);
      } catch (err) {
        console.error("Error fetching related products:", err);
      }

      setLoading(false);
    };

    fetchRelated();
  }, [product]);

if (loading) {
  return (
    <div style={{ minHeight: "400px" }} className="mt-5 p-2">
      <h4  style={{fontFamily:"archivo"}}className="mb-3">More Like This</h4>
      <div className="d-flex overflow-auto pb-2">
        {[...Array(4)].map((_, idx) => (
          <div key={idx} className="me-3">
            <div className="skeleton skeleton-card"></div>
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-price"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

  return (
    <div  style={{minHeight:"400px"}} className="mt-5 p-5">
      <h4  style={{fontFamily:"archivo"}} className="mb-3">More Like This</h4>
      {related.length > 0 ? (
        <div className="d-flex overflow-auto pb-2">
          {related.map((item) => (
            <div className="card me-3 shadow-sm border-0" key={item.id} style={{ minWidth: "180px", maxWidth: "250px" }}>
  <div style={{ height: "350px", overflow: "hidden", borderRadius: "8px" }}>
    <img
      src={item.photo}
      className="img-fluid w-100 h-100"
      alt={item.name}
      style={{ objectFit: "cover", borderRadius: "8px" }}
    />
  </div>
  <div className="card-body p-2">
    <h6 style={{ fontFamily: "archivo", fontSize: "0.95rem" }} className="card-title mb-1">{item.title}</h6>
    <p style={{ fontFamily: "archivo", fontSize: "0.9rem" }} className="card-text text-muted mb-0">₹{item.price}</p>
  </div>
</div>

          ))}
        </div>
      ) : (
        <p style={{fontFamily:"archivo"}}  className="text-center" >No similar products found.</p>
      )}
    </div>
  );
};

export default MoreLikeThis;
