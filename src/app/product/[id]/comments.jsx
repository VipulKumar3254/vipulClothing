"use client";

import "@fontsource-variable/jost";
import { useEffect, useState } from "react";
import { db } from "@/firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import "@/styles/reviews.css";

const Comments = ({ product }) => {
  const [loadingComments, setLoadingComments] = useState(true);
  const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const router = useRouter();

  // Listen for product reviews
  useEffect(() => {
    if (!product?.id) return;

    const commentsRef = collection(db, "products", product.id, "reviews");
    const q = query(commentsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(fetched);
      setLoadingComments(false);
    });

    return () => unsubscribe();
  }, [product?.id]);

  // Get logged-in user
  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (usr) => {
      if (usr) {
        try {
          const userRef = doc(db, "users", usr.uid);
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setUser({ ...userSnap.data(), uid: usr.uid });
          } else {
            alert("Please try again later");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.log("Not logged in");
        setUser(null);
      }
    });
  }, []);

  const handlePost = async () => {
    if (!newComment.trim()) return;
    if (!user) {
      alert("You must be logged in to comment");
      router.push("/login");
      return;
    }

    try {
      const commentData = {
        text: newComment,
        createdAt: serverTimestamp(),
        userId: user.uid,
        userName: user.name || "Anonymous",
      };

      const productReviewRef = await addDoc(
        collection(db, "products", product.id, "reviews"),
        commentData
      );

      await setDoc(doc(db, "recentReviews", productReviewRef.id), {
        productId: product.id,
        reviewId: productReviewRef.id,
        createdAt: serverTimestamp(),
      });

      setNewComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  return (
    <div
      style={{ minHeight: "400px", fontFamily: "Jost Variable" }}
      className="container p-3 mt-4"
    >
      <hr />
      <h4>Reviews</h4>
      <div className="d-flex gap-2 mb-3">
        <input
          style={{ fontFamily: "Jost Variable" }}
          type="text"
          className="form-control rounded-0"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a Review..."
        />
        <button
          style={{ fontFamily: "Jost Variable" }}
          onClick={handlePost}
          className="btn btn-primary rounded-0"
        >
          Post
        </button>
      </div>

      <ul className="list-group">
        {loadingComments ? (
          [...Array(3)].map((_, idx) => (
            <li key={idx} className="list-group-item">
              <div className="skeleton skeleton-comment"></div>
            </li>
          ))
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <li key={comment.id} className="list-group-item border-0">
              <strong>{comment.userName}: </strong> {comment.text}
            </li>
          ))
        ) : (
          <li className="list-group-item text-muted">No Reviews yet.</li>
        )}
      </ul>
    </div>
  );
};

export default Comments;
