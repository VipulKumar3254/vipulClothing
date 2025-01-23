import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { auth, db, collection, getDocs } from './firebase'; // Import necessary Firebase functions
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import { auth, db } from '../../../../firebaseConfig';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Users = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(null); // State to track admin status
  const [users, setUsers] = useState(null); // State to track admin status

  // Check if the user is an admin when the component mounts
  useEffect(() => {
     const auth= getAuth();
         onAuthStateChanged(auth,async (user)=>{
           const docRef = doc(db,"users",user.uid);
           const docSnap = await getDoc(docRef)
           if(docSnap.exists())
           {
           if(docSnap.data().isAdmin)
           {
               setIsAdmin(true); 
               fetchUsers()
              
           }
           }
           else{
               console.log("no data found")
           }
   
         })

  }, [navigate]);

  // Function to fetch all users from Firestore
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users')); // Retrieve all documents from the 'users' collection
      const usersList = querySnapshot.docs.map((doc) => doc.data()); // Map to get user data
      setUsers(usersList); // Update state with user data
      console.log(usersList);
    } catch (error) {
      console.error('Error fetching users: ', error);
    }
  };

  // If we are still checking admin status, show a loading spinner
  if (isAdmin === null) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If the user is not an admin, return null (user is redirected)
  if (isAdmin === false) {
    return null;
  }

  return (
    <>
      {/* Welcome Texts */}

      {/* Users List */}
      <div className="container-fluid">
        <h3 className="text-center mt-3">All Users</h3>
        {
            
        }
        <div className="row">
          { users? users.map((user, index) => (
            <div key={index} className="col-md-2 mb-3">
              <div className="card p-3">
                <img src={user.profilePhotoUrl?user.profilePhotoUrl:""} alt="" style={{height:"100px", width:"100px"}} />
                <h5>{user.name}</h5>
                <p>Email: {user.email}</p>
                <p>name: {user.name}</p>
                <p>phone: {user.phone}</p>
                <p>pincode: {user.pincode}</p>
                <p>Admin: {user.isAdmin ? 'Yes' : 'No'}</p>
              </div>
            </div>
          )) :""}
        </div>
      </div>
    </>
  );
};

export default Users;
