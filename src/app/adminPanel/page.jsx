"use client";

import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";
import { db, app } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFunctions, httpsCallable } from "firebase/functions";

import AdminStats from "@/components/admin/AdminStats"
import AdminPanelLinks from "@/components/admin/AdminPanelLinks"
import Charts from "@/components/admin/Charts"

export default function AdminPanel() {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [productCount, setProductCount] = useState(0);

  const router = useRouter();

  const fetchCounts = async () => {
    try {
      const functions = getFunctions(app);
      const getTotalUsers = httpsCallable(functions, "getTotalUsers");
      const getTotalOrders = httpsCallable(functions, "getTotalOrders");
      const getTotalProducts = httpsCallable(functions, "getTotalProducts");

      const [usersRes, ordersRes, productsRes] = await Promise.all([
        getTotalUsers(),
        getTotalOrders(),
        getTotalProducts(),
      ]);

      setUserCount(usersRes.data.totalUsers);
      setOrderCount(ordersRes.data.totalOrders);
      setProductCount(productsRes.data.totalProducts);
    } catch (error) {
      console.log("Error fetching counts:", error.message);
    } finally {
      setLoadingUsers(false);
      setLoadingOrders(false);
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/apLogin");
        return;
      }
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists() && docSnap.data().isAdmin) {
        setIsAdmin(true);
        fetchCounts();
      } else {
        router.push("/apLogin");
      }
    });
  }, [router]);

  return (
    <div className="row m-0" style={{ backgroundColor: "#F9FAFB" }}>
      {/* Sidebar */}
      <div className="bg-white border-end col-12 col-md-2 p-0 d-md-block">
        <AdminPanelLinks />
      </div>

      {/* Main Content */}
      <div className="col-12 col-md-10">
        {isAdmin === null ? (
          <div className="d-flex justify-content-center align-items-center vh-100">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Checking admin access...</span>
            </div>
          </div>
        ) : (
          <>
            <AdminStats
              userCount={userCount}
              orderCount={orderCount}
              productCount={productCount}
              loadingUsers={loadingUsers}
              loadingOrders={loadingOrders}
              loadingProducts={loadingProducts}
            />
            <Charts />
          </>
        )}
      </div>
    </div>
  );
}
