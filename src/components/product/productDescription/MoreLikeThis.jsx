import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../../firebaseConfig"; // Adjust the import based on your file structure 

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

  if (loading) return <p>Loading related products...</p>;

  return (
    <div className="mt-5 p-2">
      <h4 className="mb-3">More Like This</h4>
      {related.length > 0 ? (
        <div className="d-flex overflow-auto pb-2">
          {related.map((item) => (
            <div className="card me-3" key={item.id} style={{ minWidth: "200px" }}>
              <img
                src={item.photo}
                className="card-img-top cover"
                alt={item.name}
                style={{ height: "350px", objectFit: "cover top " }}
              />
              <div className="card-body p-2">
                <h6 className="card-title mb-1">{item.title}</h6>
                <p className="card-text text-muted mb-0">₹{item.price}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No similar products found.</p>
      )}
    </div>
  );
};

export default MoreLikeThis;
