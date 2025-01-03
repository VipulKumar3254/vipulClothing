// Login.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {db} from '../../../firebaseConfig';
import {auth} from '../../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { UserContext } from './User';
import { useContext } from 'react';
import { doc, getDoc } from "firebase/firestore";

const Login = () => {
    const User = useContext(UserContext);

const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();


    // Basic validation
    if (!email || !password) {
      setError('Both fields are required');
      return;
    }

    // Clear any previous error
    setError('');

    // Handle login logic here (e.g., call API)

    signInWithEmailAndPassword(auth, email, password)
    .then(async(userCredential) => {
      // Signed in
      const user = userCredential.user;
      localStorage.setItem("uid",user.uid);
    
const docRef = doc(db, "users", user.uid);
const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
  localStorage.setItem("user",JSON.stringify(docSnap.data()));
  User.setUser(docSnap.data());
//   console.log(JSON.parse(localStorage.getItem("user")));  TO PARSE THE USER
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such document!");
  
}



    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(errorMessage);
      console.log(error);
    })
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4" style={{ width: '400px' }}>
        <h3 className="card-title text-center mb-4">Login</h3>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
