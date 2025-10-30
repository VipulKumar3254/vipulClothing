"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import ProductInfo from "./ProductInfo";

export default function RecentReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentReviews = async () => {
      try {
        const recentRef = collection(db, "recentReviews");
        const recentQuery = query(recentRef, orderBy("createdAt", "desc"), limit(10));
        const snapshot = await getDocs(recentQuery);

        const fetchedReviews = await Promise.all(
          snapshot.docs.map(async (refDoc) => {
            const { productId, reviewId } = refDoc.data();
            const reviewDoc = await getDoc(doc(db, `products/${productId}/reviews/${reviewId}`));

            if (reviewDoc.exists()) {
              return {
                id: reviewId,
                productId,
                ...reviewDoc.data(),
              };
            }
            return null;
          })
        );

        setReviews(fetchedReviews.filter(Boolean)); // remove nulls
      } catch (error) {
        console.error("Error fetching reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentReviews();
  }, []);

  return (
    <div className="container bg-white py-3">
      <h4 className="mb-3">Recent Reviews</h4>
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : reviews.length === 0 ? (
        <p>No recent reviews found.</p>
      ) : (
        <div className="row">
          {reviews.map((review) => (
            <div className="col-md-6 mb-3" key={review.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <ProductInfo productId={review.productId} />

                  {/* Review content */}
                  <p className="mb-1 mt-2">Review: <br /> {review.text}</p>
                  <small className="text-muted">
                    {review.createdAt?.seconds &&
                      new Date(review.createdAt.seconds * 1000).toLocaleString()}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
