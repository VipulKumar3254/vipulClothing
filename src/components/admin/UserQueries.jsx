import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/firebaseConfig";

const UserQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueries = async () => {
      try {
        const q = query(collection(db, "concerns"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setQueries(results);
      } catch (error) {
        console.error("Error fetching user queries:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQueries();
  }, []);

  if (loading) {
    return <div className="text-center mt-5">Loading queries...</div>;
  }

  if (queries.length === 0) {
    return <div className="text-center mt-5">No user queries found.</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">User Queries</h2>
      <ul className="list-group">
        {queries.map((query) => (
          <li key={query.id} className="list-group-item">
            <h5>{query.name} ({query.email})</h5>
            <p className="mb-1">{query.message}</p>
            <small className="text-muted">
              {query.timestamp?.toDate().toLocaleString() || "No timestamp"}
            </small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserQueries;
