import React from 'react';
import './SignupPage.css';
import { Link } from 'react-router-dom';
import illustration from './assets/signup-illustration.png';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'MySuperSecureKey123!';

const SignupPage = () => {
  const handleSignup = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const role = e.target.role.value;

    // ✅ Encrypt the payload
    const payload = { name, email, password, role };
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(payload), SECRET_KEY).toString();

    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: encryptedData }), // ✅ Encrypted payload
      });

      const encrypted = await response.json();

      // ✅ Decrypt the response
      const bytes = CryptoJS.AES.decrypt(encrypted.data, SECRET_KEY);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      if (response.ok) {
        alert(decryptedData.msg || 'Signup successful! You can now log in.');
        window.location.href = '/';
      } else {
        alert(decryptedData.msg || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="signup-page">
      <div className="brand-header">
        <h1>Project Match</h1>
        <p className="tagline">Connecting the right people to the right projects.</p>
      </div>

      <div className="signup-wrapper">
        <div className="signup-left">
          <div className="signup-form-box">
            <h2>Get Started Now</h2>
            <form className="signup-form" onSubmit={handleSignup}>
              <input type="text" name="name" placeholder="Name" required />
              <input type="email" name="email" placeholder="Email address" required />
              <input type="password" name="password" placeholder="Password" required />

              <select name="role" className="role-select" required>
                <option value="">Select Role</option>
                <option value="hr">HR</option>
                <option value="manager">Manager HR</option>
              </select>

              <div className="checkbox-group">
                <div className="terms-container">
                  <input type="checkbox" id="terms" required />
                  <label htmlFor="terms">I agree to the terms and policy</label>
                </div>
              </div>

              <button type="submit">Signup</button>
            </form>

            <div className="social-login">
              <button className="google">Sign in with Google</button>
              <button className="github">Sign in with GitHub</button>
            </div>

            <p className="login-text">
              I have an account? <Link to="/">Sign in</Link>
            </p>
          </div>
        </div>

        <div className="signup-right">
          <img src={illustration} alt="Signup Illustration" />
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
