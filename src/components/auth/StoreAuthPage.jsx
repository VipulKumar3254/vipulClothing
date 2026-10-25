"use client";

import { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GoogleAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, db, storage } from "@/firebaseConfig";
import { userContext } from "@/components/context/context";
import "@/styles/auth.css";

const initialForm = {
  username: "", name: "", email: "", phone: "", address: "", pincode: "", password: "", confirmPassword: "",
};

function firebaseMessage(error) {
  const messages = {
    "auth/invalid-credential": "Those sign-in details don’t match an account. Please try again.",
    "auth/user-not-found": "No account was found with those details. Create an account to continue.",
    "auth/wrong-password": "That password doesn’t match this account.",
    "auth/email-already-in-use": "An account already exists with this email address. Sign in instead.",
    "auth/weak-password": "Choose a stronger password with at least 8 characters.",
    "auth/invalid-phone-number": "Enter a valid phone number with its country code.",
    "auth/invalid-app-credential": "Firebase could not verify the security check. Refresh the page and try again. If it continues, check the app's authorized domain in Firebase Authentication settings.",
    "auth/too-many-requests": "Too many attempts. Please wait a little and try again.",
    "auth/popup-closed-by-user": "The sign-in window was closed before completion.",
    "auth/unauthorized-domain": "This website is not yet enabled for Firebase sign-in. Add its domain in Firebase Authentication settings.",
  };
  return messages[error?.code] || error?.message || "Something went wrong. Please try again.";
}

export default function StoreAuthPage({ mode: initialMode }) {
  const router = useRouter();
  const { setUser } = useContext(userContext);
  const [mode, setMode] = useState(initialMode);
  const [authMode, setAuthMode] = useState("phone");
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [verification, setVerification] = useState(null);
  const captcha = useRef(null);
  const verifier = useRef(null);

  useEffect(() => () => {
    verifier.current?.clear();
    if (photoUrl.startsWith("blob:")) URL.revokeObjectURL(photoUrl);
  }, [photoUrl]);

  useEffect(() => setMode(initialMode), [initialMode]);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const setSignedInUser = async (user, profile) => {
    const userRef = doc(db, "users", user.uid);
    const snapshot = await getDoc(userRef);
    const savedProfile = snapshot.exists() ? snapshot.data() : {
      uid: user.uid,
      name: user.displayName || profile?.name || "",
      username: user.email?.split("@")[0] || "",
      email: user.email || "",
      phone: user.phoneNumber || "",
      address: "",
      pincode: "",
      profilePhotoUrl: user.photoURL || "",
    };
    if (!snapshot.exists()) await setDoc(userRef, savedProfile, { merge: true });
    localStorage.setItem("uid", user.uid);
    setUser(savedProfile);
    router.push("/");
  };

  const signInSocial = async (providerName) => {
    setError(""); setNotice(""); setLoading(true);
    try {
      const provider = providerName === "google" ? new GoogleAuthProvider() : new OAuthProvider("apple.com");
      if (providerName === "google") provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      await setSignedInUser(result.user);
    } catch (err) {
      console.error("Social sign-in failed:", err);
      setError(firebaseMessage(err));
    } finally { setLoading(false); }
  };

  const validateSignup = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Enter your full name.";
    if (!form.username.trim() || !/^[a-zA-Z0-9]+$/.test(form.username.trim())) nextErrors.username = "Use letters and numbers only, with no spaces.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Enter a valid email address.";
    if (!/^[6-9]\d{9}$/.test(form.phone)) nextErrors.phone = "Enter a valid 10-digit Indian mobile number.";
    if (form.address.trim().split(/\s+/).length < 4) nextErrors.address = "Add your house, street, locality, and city.";
    if (!/^[1-9]\d{5}$/.test(form.pincode)) nextErrors.pincode = "Enter a valid 6-digit pincode.";
    if (form.password.length < 8) nextErrors.password = "Use at least 8 characters.";
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = "Passwords don’t match.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSignup = async (event) => {
    event.preventDefault(); setError(""); setNotice("");
    if (!validateSignup()) return;
    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password);
      const displayName = form.name.trim();
      await updateProfile(credential.user, { displayName });
      let uploadedPhoto = "";
      if (photo) {
        const photoRef = ref(storage, `profile/${credential.user.uid}/${photo.name}`);
        await uploadBytes(photoRef, photo);
        uploadedPhoto = await getDownloadURL(photoRef);
      }
      const profile = {
        uid: credential.user.uid,
        username: form.username.trim(),
        name: displayName,
        email: form.email.trim(),
        phone: `+91${form.phone}`,
        address: form.address.trim(),
        pincode: form.pincode,
        profilePhotoUrl: uploadedPhoto,
        createdAt: new Date().toISOString(),
      };
      await setDoc(doc(db, "users", credential.user.uid), profile, { merge: true });
      localStorage.setItem("uid", credential.user.uid);
      setUser(profile);
      router.push("/");
    } catch (err) {
      console.error("Account creation failed:", err);
      setError(firebaseMessage(err));
    } finally { setLoading(false); }
  };

  const getRecaptcha = () => {
    if (!captcha.current) throw new Error("The phone verification box is not ready. Refresh the page and try again.");
    if (!verifier.current) verifier.current = new RecaptchaVerifier(auth, captcha.current, { size: "normal" });
    return verifier.current;
  };

  const sendOtp = async () => {
    setError(""); setNotice("");
    const normalizedPhone = form.phone.replace(/[\s()-]/g, "");
    const phoneNumber = normalizedPhone.startsWith("+") ? normalizedPhone : `+91${normalizedPhone}`;
    if (!/^\+\d{10,15}$/.test(phoneNumber)) { setError("Enter a valid mobile number, including country code."); return; }
    setLoading(true);
    try {
      const appVerifier = getRecaptcha();
      await appVerifier.render();
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setVerification(confirmation);
      setOtpSent(true);
      setNotice("A verification code has been sent to your phone.");
    } catch (err) {
      console.error("OTP request failed:", err);
      verifier.current?.clear(); verifier.current = null;
      setError(err?.code === "auth/operation-not-allowed"
        ? "Phone sign-in is not enabled for this Firebase project yet. Please contact the store administrator."
        : firebaseMessage(err));
    } finally { setLoading(false); }
  };

  const verifyOtp = async (event) => {
    event.preventDefault(); setError(""); setLoading(true);
    try {
      if (!verification) throw new Error("Request a new verification code to continue.");
      const result = await verification.confirm(otp.trim());
      await setSignedInUser(result.user);
    } catch (err) {
      console.error("OTP verification failed:", err);
      setError(err.code ? firebaseMessage(err) : (err.message || "That code is invalid. Try again."));
    } finally { setLoading(false); }
  };

  const handlePasswordLogin = async (event) => {
    event.preventDefault(); setError(""); setNotice(""); setLoading(true);
    try {
      const credential = await signInWithEmailAndPassword(auth, form.email.trim(), form.password);
      await setSignedInUser(credential.user);
    } catch (err) {
      console.error("Login failed:", err);
      setError(firebaseMessage(err));
    } finally { setLoading(false); }
  };

  const resetPassword = async () => {
    setError(""); setNotice("");
    if (!form.email.trim()) { setError("Enter your email address first, then choose forgot password."); return; }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, form.email.trim());
      setNotice("Password reset link sent. Check your email inbox.");
    } catch (err) {
      console.error("Password reset failed:", err);
      setError(firebaseMessage(err));
    } finally { setLoading(false); }
  };

  const previewPhoto = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Choose an image file for your profile photo."); return; }
    if (file.size > 4 * 1024 * 1024) { setError("Profile photos must be smaller than 4 MB."); return; }
    setPhoto(file);
    setPhotoUrl(URL.createObjectURL(file));
    setError("");
  };

  const switchMode = (nextMode) => {
    setMode(nextMode); setError(""); setNotice("");
    if (nextMode === "signup") router.replace("/createAccount");
    else router.replace("/login");
  };

  const label = (text, required = false) => <span>{text}{required && <b className="auth-required"> *</b>}</span>;
  const fieldError = (name) => errors[name] && <small className="auth-field-error">{errors[name]}</small>;
  const socials = <div className="auth-socials">
    <button type="button" onClick={() => signInSocial("google")} disabled={loading}><b className="auth-google-mark">G</b><span>Continue with Google</span></button>
    <button type="button" onClick={() => signInSocial("apple")} disabled={loading}><span className="auth-apple-mark">●</span><span>Continue with Apple</span></button>
  </div>;

  return (
    <main className={`auth-page auth-${mode}`}>
      <div className="auth-atmosphere" />
      {mode === "login" ? (
        <div className="auth-login-layout">
          <section className="auth-login-hero">
            <Image src="/stitch-assets/desktop/d5232177-b576-4ccc-963b-8a51fe54633b.jpg" alt="A tailor carefully cutting fabric in the Sonipat workshop" fill priority sizes="(max-width: 760px) 100vw, 60vw" />
            <div className="auth-hero-scrim" />
            <div className="auth-hero-top"><span>✦ &nbsp; ATELIER PROVENANCE: ROOM 04, GYASPUR</span><span>BATCH N° 44 &nbsp; • &nbsp; AUTUMN/WINTER EDIT</span></div>
            <div className="auth-hero-copy"><span className="auth-guild">✦ &nbsp; THE KUMAR GUILD</span><h1>Crafted with quiet patience.<br />Woven for honest distinction.</h1><p>Every seam tailored in our Sonipat workshop honors architectural balance, durable organic natural fibers, and the dignified spirit of restrained contemporary tailoring.</p><div className="auth-credit"><span className="auth-credit-icon">✧</span><span><b>Join the Kumar Atelier Circle</b><small>Instant ₹250 welcome credit credited upon your first order.</small></span><strong>CODE: ATELIER250</strong></div><div className="auth-hero-notes"><span>♧ Zero spam, only private releases</span><span>◴ Complimentary 7-day doorstep exchange</span></div></div>
          </section>
          <section className="auth-login-panel">
            <div className="auth-tabs" role="tablist" aria-label="Account access">
              <button type="button" className={mode === "login" ? "active" : ""} onClick={() => switchMode("login")}>Sign In</button>
              <button type="button" onClick={() => switchMode("signup")}>Create Account</button>
            </div>
            <div className="auth-login-content">
              <span className="auth-eyebrow">MEMBER GATEWAY</span><h2>Welcome Back</h2><p className="auth-intro">Enter your mobile number or registered email to access orders &amp; saved silhouettes.</p>
              {error && <div className="auth-message error" role="alert">{error}</div>}{notice && <div className="auth-message success" role="status">{notice}</div>}
              {authMode === "phone" ? (
                <form onSubmit={otpSent ? verifyOtp : (e) => { e.preventDefault(); sendOtp(); }}>
                  <div className="auth-label-row"><label htmlFor="auth-phone">Mobile Number</label><small>OTP login supported</small></div>
                  <div className="auth-input-wrap"><span className="auth-input-icon">▯</span><span className="auth-prefix">+91</span><input id="auth-phone" name="phone" inputMode="tel" autoComplete="tel-national" placeholder="98765 43210" value={form.phone} onChange={updateField} required /></div>
                  {otpSent && <div className="auth-field"><label htmlFor="auth-otp">Verification Code</label><input id="auth-otp" className="auth-input" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="Enter 6-digit code" value={otp} onChange={(e) => setOtp(e.target.value)} required /></div>}
                  <div className="auth-mode-switch"><button type="button" onClick={() => { setAuthMode("email"); setOtpSent(false); setError(""); }}>♧ &nbsp; Sign in with password instead</button><small>Standard SMS rates may apply</small></div>
                  <div id="auth-recaptcha" ref={captcha} className="auth-recaptcha" />
                  <button className="auth-primary" type="submit" disabled={loading}>{loading ? "Please wait…" : otpSent ? "Verify & Sign In" : "Request 4-Digit Login OTP"}<span>→</span></button>
                </form>
              ) : (
                <form onSubmit={handlePasswordLogin}>
                  <div className="auth-label-row"><label htmlFor="auth-email">Email Address</label><button type="button" onClick={() => { setAuthMode("phone"); setError(""); }}>Use phone OTP</button></div>
                  <input className="auth-input" type="email" id="auth-email" name="email" autoComplete="email" placeholder="name@domain.com" value={form.email} onChange={updateField} required />
                  <div className="auth-label-row auth-password-label"><label htmlFor="auth-password">Password</label><button type="button" onClick={resetPassword}>Forgot password?</button></div>
                  <input className="auth-input" type="password" id="auth-password" name="password" autoComplete="current-password" placeholder="Your password" value={form.password} onChange={updateField} required />
                  <button className="auth-primary" type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign In Securely"}<span>→</span></button>
                </form>
              )}
              <div className="auth-divider"><span>OR FAST AUTHENTICATIONS</span></div>{socials}
            </div>
            <div className="auth-login-assurance"><span>♙ &nbsp;256-Bit Encrypted Session</span><Link href="/termsConditions">Store Terms &amp; Privacy</Link><span>Sonipat Tailoring Concierge: <b>+91 83079 49189</b></span></div>
          </section>
          <div className="auth-login-benefits"><article><i>▤</i><div><h3>Artisanal Fit Profiles</h3><p>Save individual shoulder, chest, and inseam measurements for tailored drape recommendations across jackets and shirts.</p></div></article><article><i>♧</i><div><h3>Archival Priority</h3><p>Gain 24-hour advance entry to limited summer linen restocks, selvedge denim lots, and Haryana handloom releases.</p></div></article><article><i>⟳</i><div><h3>Doorstep Fitting</h3><p>Order standard sizes with the option for our regional Sonipat tailoring team to alter hem and cuffs right at delivery.</p></div></article></div>
        </div>
      ) : (
        <div className="auth-signup-layout">
          <header className="auth-signup-heading"><div><span className="auth-eyebrow">● &nbsp; CLIENT CONCIERGE &amp; GUILD REGISTRY</span><h1>Begin Your Atelier Journey</h1></div><p>Already possess an atelier key? <button type="button" onClick={() => switchMode("login")}>Sign in here</button></p></header>
          <div className="auth-signup-grid">
            <aside className="auth-signup-aside">
              <div className="auth-signup-story"><Image src="/stitch-assets/desktop/d5232177-b576-4ccc-963b-8a51fe54633b.jpg" alt="Kumar Fashion tailor at work" fill sizes="(max-width: 760px) 100vw, 40vw" /><div className="auth-story-scrim"/><span className="auth-provenance">♧ &nbsp; SONIPAT ATELIER • ROOM 04</span><div><span className="auth-eyebrow">AUTHENTIC TAILORING HOUSE</span><h2>“Clothes sculpted to the person, not measured to an algorithm.”</h2></div></div>
              <div className="auth-privileges"><div className="auth-credit"><span className="auth-credit-icon">✧</span><span><b>WELCOME PATRON PRIVILEGE</b><small>₹250 First Order Atelier Credit</small></span><strong>ATELIER250</strong></div><div className="auth-perk"><i>▣</i><span><b>Bespoke Fit Archiving</b><small>Your silhouette measurements and drape preferences recorded by our master cutting masters.</small></span></div><div className="auth-perk"><i>◉</i><span><b>Limited Batch First Access</b><small>24-hour private season windows prior to public seasonal jacket and selvage denim drops.</small></span></div><div className="auth-perk"><i>▱</i><span><b>7-Day Doorstep Trial</b><small>Complimentary Pan-India exchanges and alterations arranged directly with our Sonipat workshop.</small></span></div><div className="auth-heritage-note"><span>♙ &nbsp; KUMAR FASHION STANDARD</span><small>Over 1,200 curated silhouettes delivered across Haryana, Delhi NCR, and nationwide.</small></div></div>
            </aside>
            <section className="auth-signup-card">
              <div className="auth-signup-card-head"><span className="auth-eyebrow">STEP 01 / REGISTRATION FORM</span><h2>Create Patron Account</h2><p>Enter your details below to establish your tailoring account and unlock member perks.</p>{error && <div className="auth-message error" role="alert">{error}</div>}{notice && <div className="auth-message success" role="status">{notice}</div>}{socials}<div className="auth-divider"><span>OR MANUAL ENTRY</span></div></div>
              <form className="auth-signup-form" onSubmit={handleSignup} noValidate>
                <section className="auth-form-section"><header><h3>1. PERSONAL IDENTITY</h3><small>Required Credentials</small></header><label className="auth-photo-field"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={previewPhoto}/><span className="auth-photo-preview">{photoUrl ? <img src={photoUrl} alt="Profile photo preview"/> : "♙"}</span><span><b>{photo ? photo.name : "Choose Profile Photo"}</b><small>PNG, JPG or WEBP (Max 4MB)</small><small>Add your portrait to personalize packaging and fitting notes.</small></span><strong>ATELIER250</strong></label>
                  <div className="auth-fields-grid"><div className="auth-field"><label htmlFor="signup-username">{label("Username", true)}</label><div className="auth-input-wrap"><span className="auth-input-icon">＠</span><input id="signup-username" name="username" autoComplete="username" placeholder="vipul_kumar" value={form.username} onChange={updateField}/></div>{fieldError("username")}</div><div className="auth-field"><label htmlFor="signup-name">{label("Full Name", true)}</label><div className="auth-input-wrap"><span className="auth-input-icon">♙</span><input id="signup-name" name="name" autoComplete="name" placeholder="Vipul Kumar" value={form.name} onChange={updateField}/></div>{fieldError("name")}</div><div className="auth-field"><label htmlFor="signup-email">{label("Email Address", true)}</label><div className="auth-input-wrap"><span className="auth-input-icon">✉</span><input id="signup-email" type="email" name="email" autoComplete="email" placeholder="vipulkumar@gmail.com" value={form.email} onChange={updateField}/></div>{fieldError("email")}</div><div className="auth-field"><label htmlFor="signup-phone">{label("Phone Number", true)}</label><div className="auth-input-wrap"><span className="auth-prefix">+91</span><input id="signup-phone" inputMode="tel" name="phone" autoComplete="tel-national" placeholder="83079 49189" value={form.phone} onChange={updateField}/></div>{fieldError("phone")}</div></div><small className="auth-field-hint">Used for bespoke order lookups and boutique VIP tracking.</small></section>
                <section className="auth-form-section"><header><h3>2. FITTING &amp; SHIPPING RESIDENCE</h3><small>Pan-India Courier Dispatch</small></header><div className="auth-field"><label htmlFor="signup-address">{label("Delivery Address / House", true)}</label><div className="auth-input-wrap"><span className="auth-input-icon">⌖</span><input id="signup-address" name="address" autoComplete="street-address" placeholder="House No., Street name, Landmark, Village or Colony Name" value={form.address} onChange={updateField}/></div>{fieldError("address")}</div><div className="auth-pincode-row"><div className="auth-field"><label htmlFor="signup-pincode">{label("Pincode", true)}</label><div className="auth-input-wrap"><span className="auth-input-icon">▣</span><input id="signup-pincode" name="pincode" inputMode="numeric" autoComplete="postal-code" maxLength={6} placeholder="131001" value={form.pincode} onChange={updateField}/></div>{fieldError("pincode")}</div><small>▣ &nbsp;Region: Sonipat / Delhi-NCR Hub<br/><b>24–48 Hr Local Workshop Dispatch</b></small></div><small className="auth-field-hint auth-green-hint">♧ &nbsp; Complimentary premium courier &amp; bespoke trials across Sonipat &amp; Pan-India</small></section>
                <section className="auth-form-section"><header><h3>3. ACCESS &amp; PROTECTION</h3><small>Encrypted Credentials</small></header><div className="auth-fields-grid"><div className="auth-field"><label htmlFor="signup-password">{label("Password", true)}</label><input className="auth-input" id="signup-password" type="password" name="password" autoComplete="new-password" minLength={8} placeholder="Minimum 8 characters" value={form.password} onChange={updateField}/><div className="auth-password-strength"><span style={{width:`${Math.min(form.password.length * 12, 100)}%`}}/></div><small>Strength: {form.password.length >= 8 ? "Good" : "Build"}</small>{fieldError("password")}</div><div className="auth-field"><label htmlFor="signup-confirm">{label("Confirm Password", true)}</label><input className="auth-input" id="signup-confirm" type="password" name="confirmPassword" autoComplete="new-password" placeholder="Re-enter your password" value={form.confirmPassword} onChange={updateField}/>{fieldError("confirmPassword")}</div></div></section>
                <label className="auth-consent"><input type="checkbox" required/><span>I accept the <Link href="/termsConditions">Terms &amp; Conditions</Link> and <Link href="/privacyPolicy">Privacy Policy</Link>, and agree to receive tailored styling communications.</span></label>
                <button className="auth-primary" type="submit" disabled={loading}>{loading ? "Creating your account…" : "Create Atelier Account & Claim ₹250 Credit"}<span>→</span></button><p className="auth-signin-prompt">Already possess an account? <button type="button" onClick={() => switchMode("login")}>Sign in directly</button></p>
              </form>
            </section>
          </div>
          <footer className="auth-signup-footer"><span>♙ &nbsp; ENCRYPTED VAULT <small>PCI-DSS &amp; SSL certified account safeguards</small></span><span>▤ &nbsp; ATELIER DIRECT <small>Handcrafted and dispatched from Gyaspur</small></span><span>⇄ &nbsp; DOORSTEP FITTING <small>Easy size adjustment within 7 calendar days</small></span><span>▣ &nbsp; CONCIERGE CARE <small>+91 83079 49189 (10 AM – 8 PM IST)</small></span></footer>
        </div>
      )}
      <div className="auth-mobile-help"><span>Sonipat Concierge &amp; Fittings</span><small>Gyaspur, Sonipat, Haryana</small><div><a href="tel:+918307949189">☎ +91 83079 49189</a><a href="https://wa.me/918307949189">WhatsApp Care</a></div></div>
    </main>
  );
}
