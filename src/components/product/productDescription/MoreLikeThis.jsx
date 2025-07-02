import "@fontsource-variable/jost"
import { useEffect, useState } from "react";
import { collection, query, where, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "../../../../firebaseConfig"; // Adjust the import based on your file structure 
import "../../../css/MoreLikeThis.css"
import { getAuth, onAuthStateChanged } from "firebase/auth";
import toast, { Toaster } from "react-hot-toast";

const MoreLikeThis = ({ product }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({})
  
useEffect(() => {
  const auth = getAuth();
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    console.log(user);
    setUser(user || null);
  });

  return () => unsubscribe(); // clean up on unmount
}, []);



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
        <h4 style={{ fontFamily: "Jost Variable" }} className="mb-3">More Like This</h4>
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

  const handleWishList = async (e, product) => {
    e.preventDefault();
    console.log(user);
    e.stopPropagation();

    const wishListItem = {
      title: product.title,
      price: product.price,
      photo: product.photo,
      productId: product.id,
      userId: user?.uid,
    };

    try {
      if (!user) {
        throw new Error("User not logged in");
      }

      await setDoc(doc(db, `users/${user.uid}/wishList`, product.id), wishListItem);
      toast.custom((t) => (
        <div
          className="toaster bg-success text-white px-5 py-2  shadow-sm d-flex justify-content-between align-items-center "
          style={{ fontFamily: "Jost Variable", fontSize: "12px", width: "" }}
        >
          <span className="text-center">Added to WishList</span>

          <button
            className="btn btn-sm btn-light ms-3"
            onClick={() => toast.dismiss(t.id)}
            style={{ fontSize: "12px" }}
          >
            Close
          </button>
        </div>
      ), { duration: 5000 });


    } catch (err) {
      console.error(err);

      const message = err.message === "User not logged in"
        ? "Please login to add items to wishlist"
        : "Something went wrong";

      toast.custom((t) => (
        <div
          className=" toaster bg-danger text-white px-5 py-2  shadow-sm d-flex justify-content-between align-items-center"
          style={{ fontFamily: "Jost Variable", fontSize: "12px" }}
        >
          <span>{message}</span>
          <button
            className="btn btn-sm btn-light ms-3"
            onClick={() => toast.dismiss(t.id)}
            style={{ fontSize: "12px" }}
          >
            Close
          </button>
        </div>
      ), { duration: 5000 });
    }
  };


  return (
    <div style={{ minHeight: "400px" }} className="mt-5 px-1">
      <h4 style={{ fontFamily: "Jost Variable" }} className="mb-3">More Like This</h4>
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
                <h6 style={{ fontFamily: "Jost Variable", fontSize: "0.9rem" }} className="card-title mb-1 fw-normal">{item.title}</h6>
                <div className="mt-2 cursor-pointer  ">
                  <p
                    style={{ backgroundColor: "#FFCE12", }} id="fontSize"
                    className=" d-inline   px-3 py-1  border rounded-5 cursor-pointer"
                    onClick={(e) => handleWishList(e, item)}

                  >
                    Add to Wishlist
                  </p>
                </div>
                <p style={{ fontFamily: "Jost Variable", fontSize: "1.1rem" }} className="card-text fw-medium text-muted mb-0 mt-2 price ">₹{item.price}</p>
              </div>
            </div>

          ))}
        </div>
      ) : (
        <p style={{ fontFamily: "Jost Variable" }} className="text-center" >No similar products found.</p>
      )}

      <Toaster position="bottom-left" />
    </div>
  );
};

export default MoreLikeThis;
