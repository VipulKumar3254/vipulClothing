// ApLogin.jsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { userContext } from '../../context/context';
// import { auth, signInWithEmailAndPassword, db, doc, getDoc } from './firebase';
const APLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const usercontext = useContext(userContext)

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Sign in the user with email and password
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user document from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // Check if the user is an admin
        if (userData.isAdmin) {
          // Redirect to the Admin Panel
          console.log("setting  the user data ",userData);
          usercontext.setUser(userData)
          navigate('/adminPanel');
          return;
          
        } else {
          setError('You are not authorized to access the admin panel.');
        }
      } else {
        setError('User document does not exist.');
      }
    } catch (err) {
      setError('Invalid username or password');
      console.error('Login Error:', err.message);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 w-100 w-md-50" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Admin Login</h2>
        {error && <p className="text-danger text-center mb-4">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              placeholder="Enter your password"
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

export default APLogin;
