import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';

const TotalUsersCard = () => {
  const [totalUsers, setTotalUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchTotalUsers = async () => {
    try {
      const functions = getFunctions();
      const getTotalUsers = httpsCallable(functions, 'getTotalUsers');
      const result = await getTotalUsers();
      setTotalUsers(result.data.totalUsers);
      console.log("Total users:", result.data.totalUsers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchTotalUsers();
}, []);

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-sm">
      <h2 className="text-lg font-semibold mb-2">Total Users</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <p className="text-3xl font-bold text-blue-600">{totalUsers}</p>
      )}
    </div>
  );
};

export default TotalUsersCard;
