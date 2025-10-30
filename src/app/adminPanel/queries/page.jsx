"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import toast from "react-hot-toast";

const UserQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all | solved | unsolved

  const fetchQueries = async () => {
    try {
      const q = query(collection(db, "concerns"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        solved: docSnap.data().solved || false, // read from Firestore or default
        ...docSnap.data(),
      }));
      setQueries(results);
    } catch (error) {
      console.error("Error fetching user queries:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsSolved = async (id) => {
    try {
      const queryRef = doc(db, "concerns", id);
      await updateDoc(queryRef, { solved: true });
      setQueries((prev) =>
        prev.map((q) => (q.id === id ? { ...q, solved: true } : q))
      );
      toast.success("Marked as solved!");
    } catch (error) {
      console.error("Error marking query as solved:", error);
      toast.error("Failed to mark as solved.");
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const filteredQueries = queries.filter((q) => {
    if (filter === "solved") return q.solved === true;
    if (filter === "unsolved") return !q.solved;
    return true;
  });

  if (loading) {
    return <div className="text-center mt-5">Loading queries...</div>;
  }

  if (filteredQueries.length === 0) {
    return <div className="text-center mt-5">No user queries found.</div>;
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">User Queries</h2>

      {/* Filter dropdown */}
      <div className="mb-3 text-start">
        <select
          className="form-select w-auto d-inline-block"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="unsolved">Unsolved</option>
          <option value="solved">Solved</option>
        </select>
      </div>

      {/* Query list */}
      <ul className="list-group">
        {filteredQueries.map((query) => (
          <li
            key={query.id}
            className="list-group-item d-flex justify-content-between align-items-start"
          >
            <div>
              <h5>
                {query.name}{" "}
                {query.solved && <span className="badge bg-success">Solved</span>}
              </h5>
              <p className="m-0">{query.phone}</p>
              <p className="mb-1">{query.query}</p>
              <small className="text-muted">
                {query.timestamp?.toDate().toLocaleString() || "No timestamp"}
              </small>
            </div>
            {!query.solved && (
              <button
                className="btn btn-sm btn-success"
                onClick={() => markAsSolved(query.id)}
              >
                Mark Solved
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserQueries;
