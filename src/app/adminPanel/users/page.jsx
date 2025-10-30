"use client";

// import profileAvatar from "@/assets/profileAvatar.jpg";
import profileAvatar from "@/../public/profileAvatar.jpg"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "bootstrap/dist/css/bootstrap.min.css";
import { auth, db } from "@/firebaseConfig";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const Users = () => {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  useEffect(() => {
    const checkAdminAndFetchUsers = async () => {
      const authInstance = getAuth();
      onAuthStateChanged(authInstance, async (user) => {
        if (!user) {
          setIsAdmin(false);
          router.push("/apLogin");
          return;
        }

        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && userDoc.data().isAdmin) {
            setIsAdmin(true);
            await fetchUsers();
          } else {
            setIsAdmin(false);
            router.push("/apLogin");
          }
        } catch (error) {
          console.error("Error checking admin:", error);
          setIsAdmin(false);
        }
      });
    };

    checkAdminAndFetchUsers();
  }, [router]);

  const fetchUsers = async () => {
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const userList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
      console.log(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  return (
    <div className="container-fluid">
      {/* Sticky Header */}
      <div
        className="bg-white mt-5 px-2 position-sticky top-0"
        style={{ zIndex: 999 }}
      >
        <h2 className="text-center m-0">Customers</h2>
      </div>

      {/* Loading State */}
      {isAdmin === null || loadingUsers ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row mt-3">
          {users.map((user, index) => (
            <div key={index} className="col-md-2 mb-3">
              <div className="card p-3 shadow-sm h-100">
                <img
                  src={
                    user.profilePhotoUrl?.length > 4
                      ? user.profilePhotoUrl
                      : profileAvatar.src
                  }
                  className="img-fluid rounded-circle mx-auto d-block mb-2"
                  style={{
                    height: "100px",
                    width: "100px",
                    objectFit: "cover",
                  }}
                  alt="User Avatar"
                />
                <h6 className="text-center">{user.name || "Unnamed"}</h6>
                <p className="mb-1">
                  <strong>Email:</strong> {user.email}
                </p>
                <p className="mb-1">
                  <strong>Phone:</strong> {user.phone || "-"}
                </p>
                <p className="mb-1">
                  <strong>Pincode:</strong> {user.pincode || "-"}
                </p>
                <p className="mb-1">
                  <strong>Admin:</strong> {user.isAdmin ? "Yes" : "No"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
