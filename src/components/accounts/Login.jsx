// Login.js
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { db } from '../../../firebaseConfig';
import { auth } from '../../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useContext } from 'react';
import { doc, getDoc } from "firebase/firestore";
import { userContext } from '../context/context';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const User = useContext(userContext)
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Basic validation
    if (!email || !password) {
      setError('Both fields are required');
      return;
    }

    // Clear any previous error
    setError('');

    // Handle login logic here (e.g., call API)

    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        localStorage.setItem("uid", user.uid);

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          User.setUser(docSnap.data());
          setLoading(false)
          navigate("/");
        } else {
          User.setUser(null);
        }



      })
      .catch((error) => {
        setLoading(false);
        const errorCode = error.code;
        const errorMessage = error.message;
        setError("Enter Valid Credentials");
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
            {loading ?
              (
                <div class="spinner-border" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              ):"Login"}
          </button>
        </form>
        <div className="">
          <p className=' m-0 mt-3 text-center'>dont have account?</p>
          <button className="btn btn-primary w-100" onClick={() => navigate("/createAccount")}>Sign-Up</button>
        </div>
      </div>

    </div>
  );
};

export default Login;
