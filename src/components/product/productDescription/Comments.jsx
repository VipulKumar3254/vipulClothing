import { useEffect, useState } from "react";
import { db, auth } from "../../../../firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Comments = ({ product }) => {

   const [user, setUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");



    useEffect(() => {
        const auth = getAuth();
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userRef = doc(db, "users", user.uid);
                    const userSnap = await getDoc(userRef);
                    if (userSnap.exists()) {
                        setUser( {...userSnap.data(),uid:user.uid});
                        console.log("user is ", userSnap.data());
                    } else {
                        alert("Please try again later");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                console.log("Not logged in");
                setUser(null);
                navigate("/login");
            }
        
        });
    }, []);

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
    });

    return () => unsubscribe();
  }, [product?.id]);

  const handlePost = async () => {
    if (!newComment.trim()) return;
    if (!user) return alert("You must be logged in to comment");

    const commentData = {
      text: newComment,
      createdAt: serverTimestamp(),
      userId: user.uid,
      userName: user.name || "Anonymous",
    };


    console.log(product.id, "product id is here");
    await addDoc(collection(db, "products", product.id, "reviews"), commentData);
    setNewComment("");
  };

  return (

    <div style={{ minHeight:"400px"}} className=" min-h p-3  shadow-sm mt-4">
      <hr />
      <h5>Reviews</h5>
      <div className="d-flex gap-2 mb-3">
        <input
          type="text"
          className="form-control"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a Review..."
        />
        <button onClick={handlePost} className="btn btn-primary">Post</button>
      </div>

      <ul className="list-group">
        {comments.map((comment) => (
          <li key={comment.id} className="list-group-item">
            <strong>{comment.userName}: </strong> {comment.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Comments;
