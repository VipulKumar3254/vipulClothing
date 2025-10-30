"use client";
import React, { useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/createAccount.css";
import { auth, db, storage } from "@/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Toaster, toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AccountCreation() {
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    pincode: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState();
  const [preview, setPreview] = useState(null);

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { username, name, email, phone, address, pincode, password, confirmPassword } = formData;

    if (!username) newErrors.username = "Username is required";
    const usernameResult = validateUserName(username);
    if (!usernameResult.valid) newErrors.username = usernameResult.message;

    if (!name) newErrors.name = "Name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!isValidEmail(email)) newErrors.email = "Enter valid Email";

    if (!phone) newErrors.phone = "Phone number is required";
    else if (!isValidPhoneNumber(phone)) newErrors.phone = "Enter valid Phone Number";

    if (!address) newErrors.address = "Address is required";
    else if (address.trim().split(/\s+/).length < 4)
      newErrors.address = "At least 4 segments are required.";

    if (!pincode) newErrors.pincode = "Pincode is required";
    else if (!isValidPincode(pincode)) newErrors.pincode = "Enter Valid Pincode.";

    if (!password) newErrors.password = "Password is required";
    const passwordError = validatePassword(password);
    if (passwordError) newErrors.password = passwordError;

    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidPhoneNumber = (phone) => /^[6-9]\d{9}$/.test(phone);
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPincode = (pincode) => /^[1-9][0-9]{5}$/.test(pincode);

  const validatePassword = (password) => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[a-z]/.test(password)) return "Must include a lowercase letter";
    if (!/[A-Z]/.test(password)) return "Must include an uppercase letter";
    if (!/\d/.test(password)) return "Must include a digit";
    if (!/[!@#$%^&*]/.test(password)) return "Must include a special character";
    return "";
  };

  const validateUserName = (username) => {
    const trimmed = username?.trim();
    if (!trimmed) return { valid: false, message: "Username is required" };
    if (trimmed.split(/\s+/).length > 1)
      return { valid: false, message: "Username must be a single word" };
    if (!/^[a-zA-Z0-9]+$/.test(trimmed))
      return { valid: false, message: "Only letters and numbers allowed" };
    return { valid: true, message: "" };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      let profilePhotoUrl = "null";
      if (profilePhoto) {
        const storageRef = ref(storage, `profile/${user.uid}`);
        await uploadBytes(storageRef, profilePhoto);
        profilePhotoUrl = await getDownloadURL(storageRef);
      }

      const userDoc = doc(db, "users", user.uid);
      await setDoc(userDoc, { ...formData, profilePhotoUrl });

      toast.success("Account created successfully!");
      router.push("/login");
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already in use");
      } else if (error.code === "auth/weak-password") {
        toast.error("Weak password");
      } else {
        toast.error("Something went wrong, try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} className="p-4 bg-light border rounded">
        {/* --- User Info Fields --- */}
        <div className="row">
          <div className="col-9">
            {/* Username */}
            <div className="form-group mb-3">
              <label>Username</label>
              <input
                type="text"
                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
              {errors.username && <div className="invalid-feedback">{errors.username}</div>}
            </div>

            {/* Name */}
            <div className="form-group mb-3">
              <label>Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            {/* Email */}
            <div className="form-group mb-3">
              <label>Email</label>
              <input
                type="email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            {/* Phone */}
            <div className="form-group mb-3">
              <label>Phone</label>
              <input
                type="text"
                className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
            </div>
          </div>

          {/* Profile Photo */}
          <div className="col-3 p-0">
            <input onChange={handlePhotoChange} accept="image/*" className="d-none" type="file" id="photo" />
            <label htmlFor="photo" className="border border-secondary-subtle d-block text-center">
              <img
                src={preview || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                alt="Preview"
                className="img-fluid"
              />
              <p className="text-dark mt-1">Choose profile photo</p>
            </label>
          </div>
        </div>

        {/* Address */}
        <div className="form-group mb-3">
          <label>Address</label>
          <input
            type="text"
            className={`form-control ${errors.address ? "is-invalid" : ""}`}
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          {errors.address && <div className="invalid-feedback">{errors.address}</div>}
        </div>

        {/* Pincode */}
        <div className="form-group mb-3">
          <label>Pincode</label>
          <input
            type="text"
            className={`form-control ${errors.pincode ? "is-invalid" : ""}`}
            name="pincode"
            value={formData.pincode}
            onChange={handleChange}
          />
          {errors.pincode && <div className="invalid-feedback">{errors.pincode}</div>}
        </div>

        {/* Password */}
        <div className="form-group mb-3">
          <label>Password</label>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <div className="invalid-feedback">{errors.password}</div>}
        </div>

        {/* Confirm Password */}
        <div className="form-group mb-3">
          <label>Confirm Password</label>
          <input
            type="password"
            className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
        </div>

        {/* Submit Button */}
        <button disabled={loading} type="submit" className="btn btn-primary w-100">
          {loading ? "Processing..." : "Create Account"}
        </button>
      </form>
      <Toaster position="bottom-left" />
    </div>
  );
}
