import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../../../../firebaseConfig';

const TotalUsersCard = () => {
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalOrders, setTotalOrders] = useState(null);
  const [totalProducts, setTotalProducts] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchTotalUsers = async () => {
    try {
      const functions = getFunctions(app);
      const getTotalUsers = httpsCallable(functions, 'getTotalUsers');
      const getTotalOrders = httpsCallable(functions, 'getTotalOrders');
      const getTotalProducts= httpsCallable(functions,"getTotalProducts");
      const tempProducts  = await getTotalProducts();
      const result = await getTotalUsers();
      const tempOrders = await getTotalOrders();
      setTotalOrders(tempOrders.data.totalOrders)
      setTotalUsers(result.data.totalUsers);
      setTotalProducts  (tempProducts.data.totalProducts)
      console.log("Total users:", result.data.totalUsers);
    } catch (err) {
      setError(err.message);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  fetchTotalUsers();
}, []);


  return (
    <div className='row justify-content-evenly mt-2'>

 

<div className="col-12 col-md-3">
  <div className="card border-0 rounded-4"  style={{background:"#f0f4f8",height:"260px"}}>
    <div className="card-body d-flex flex-column justify-content-between text-center py-4">
      <h6 className="text-muted text-uppercase">Registered Customers</h6>
      <h1 className="text-dark fw-bold">{loading? "Loading":totalUsers}</h1>
      <p className="text-success small mb-0">↑ 5.8% this month</p>
      <p className="text-success small mb-0"></p>
    </div>
  </div>
</div>

<div className="col-12 col-md-3">
  <div className="card border-0 rounded-4"  style={{background:"#f0f4f8",height:"260px"}}>
    <div className="card-body d-flex flex-column justify-content-between text-center py-4">
      <h6 className="text-muted text-uppercase">Total Orders</h6>
      <h1 className="text-dark fw-bold">{loading? "Loading":totalOrders}</h1>
      <p className="text-success small mb-0"></p>
    </div>
  </div>
</div>

<div className="col-12 col-md-3">
  <div className="card border-0 rounded-4"  style={{background:"#f0f4f8",height:"260px"}}>
    <div className="card-body d-flex flex-column justify-content-between text-center py-4">
      <h6 className="text-muted text-uppercase">Listed Products</h6>
      <h1 className="text-dark fw-bold">{loading? "Loading":totalProducts}</h1>
      <p className="text-success small mb-0"></p>
    </div>
  </div>
</div>


      </div>
  );
};

export default TotalUsersCard;
