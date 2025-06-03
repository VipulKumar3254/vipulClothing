import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../css/createAccount.css";
import { useRef } from 'react';
import { auth, db, storage } from '../../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, Firestore, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { Toaster, toast } from 'react-hot-toast';



const AccountCreation = () => {
  const [errors, setErrors] = useState({});
  const black_background = useRef(null);
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    pincode: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const [profilePhoto, setProfilePhoto] = useState();
  const [preview, setPreview] = useState(null);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];

    if (file) {
      setProfilePhoto(file);

      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    console.log(formData);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    const result = validateUserName(formData.username
    )
    if (!result.valid) {
      newErrors.username = result.message;
    }
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!isValidEmail(formData.email)) {
      newErrors.email = "Enter valid Email";
    }

    if (!formData.phone) newErrors.phone = 'Phone number is required';
    if (!isValidPhoneNumber(formData.phone)) {
      newErrors.phone = "Enter valid Phone Number";
    }
    if (!formData.address) newErrors.address = 'Address is required';
    const words = formData.address.trim().split(/\s+/);
    if (words.length < 4) {
      newErrors.address = "Atleast 4 segments are required.";
    }

    if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    if (!isValidPincode(formData.pincode)) {
      newErrors.pincode = "Enter Valid Pincode.";
    }
    if (!formData.password) newErrors.password = 'Password is required';
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      newErrors.password = passwordError;
    }
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const isValidPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, ''); // Strip non-digits
    const parsed = parseInt(cleaned, 10);
    const isValid = !isNaN(parsed) && /^\d{10}$/.test(cleaned) && /^[6-9]/.test(cleaned);
    return isValid;
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isValidPincode = (pincode) => {
    const parsed = parseInt(pincode, 10);
    return (
      !isNaN(parsed) &&
      pincode.length === 6 &&
      /^[1-9][0-9]{5}$/.test(pincode)
    );
  };

  const validatePassword = (password) => {
    if (!password || password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must include at least one lowercase letter";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must include at least one uppercase letter";
    }
    if (!/\d/.test(password)) {
      return "Password must include at least one digit";
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return "Password must include at least one special character (!@#$%^&*)";
    }
    return ""; // No error, password is strong
  };

  const validateUserName = (username) => {
    const trimmed = username?.trim();

    if (!trimmed) {
      return {
        valid: false,
        type: "required",
        message: "Username is required",
      };
    }

    if (trimmed.split(/\s+/).length > 1) {
      return {
        valid: false,
        type: "multiword",
        message: "Username must be a single word (no spaces)",
      };
    }

    if (!/^[a-zA-Z0-9]+$/.test(trimmed)) {
      return {
        valid: false,
        type: "invalid-char",
        message: "Username must contain only letters and numbers (no special characters)",
      };
    }

    return {
      valid: true,
      type: null,
      message: "",
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (validateForm()) {
      console.log('Form submitted:', formData);

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // storing profile photo in firebase storage
        let profilePhotoUrl = "";
        if (profilePhoto) {

          const storageRef = ref(storage, `profile/${user.uid}`);
          await uploadBytes(storageRef, profilePhoto);
          profilePhotoUrl = await getDownloadURL(storageRef);
        }
        else {
          profilePhotoUrl = "null";
        }
        console.log("profile photo url is " + profilePhotoUrl);

        // storing user data in firebase
        const userData = doc(db, "users", user.uid);
        await setDoc(userData, {
          username: formData.username,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          pincode: formData.pincode,
          profilePhotoUrl,
        });
        setLoading(false)
        toast.success('Account created Successfully.', { duration: 4000 });

        console.log("account created successfully");
      }
      catch (error) {
        setLoading(false);

        if (error.code === 'auth/email-already-in-use') {
          alert("❌ E-mail is already in use,Plase Use another Email Id");
        } else if (error.code === 'auth/weak-password') {
          alert("❌ Weak password, Use a strong password");
        } else if (error.code === 'auth/invalid-email') {
          alert("❌ Use Valid E-mail id");
        } else {
          alert("⚠️ Something went wrong, Plase try again after some time.");
          console.log(error);
        }
      }

    }
    else {
      setLoading(false);
      console.log("Enter proper details.");
    }

  };

  return (
    <div className="container mt-5">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} className="p-4 bg-light border rounded">

        <div>
          <div className="row">

            <div className="col-9">
              <div className="form-group mb-3">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  className={`form-control ${errors.username ? 'is-invalid' : ''}  `}
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
              </div>

              <div className="form-group mb-3">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="form-group mb-3">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="form-group mb-3">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>

            </div>
            <div className="col-3 position-relative  p-0">
              {/* <div ref={black_background} id='black_background' className="text-light fs-4  text-center">
            
                  </div> */}
              <input onChange={handlePhotoChange} accept='image/*' className='d-none' type="file" name="photo" id="photo" />
              <label id='label' className="border border-secondary-subtle " htmlFor="photo">

                <img src={preview ? preview : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} alt="" className='img-fluid' />
                <p className='text-center text-dark mt-1 '>   Choose profile photo</p>

              </label>
            </div>


          </div>
        </div>


        <div className="form-group mb-3">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            className={`form-control ${errors.address ? 'is-invalid' : ''}`}
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <div className="invalid-feedback">{errors.address}</div>}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="pincode">Pincode</label>
          <input
            type="text"
            className={`form-control ${errors.pincode ? 'is-invalid' : ''}`}
            id="pincode"
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
          />
          {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
        </div>

        <button disabled={loading} type="submit" className="btn btn-primary w-100">  {loading && (
          <span
            style={{
              width: "16px",
              height: "16px",
              border: "2px solid #fff",
              borderTop: "2px solid transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
        )}
          {loading ? "Processing..." : "Create Account"}</button>
      </form>
      <Toaster position="bottom-left" />

    </div>
  );
};

export default AccountCreation;
