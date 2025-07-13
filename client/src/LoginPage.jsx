import React from 'react';
import './LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';
import illustration from './assets/signup-illustration.png';
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'MySuperSecureKey123!'; // Match your backend

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    // 🔐 Encrypt payload
    const encryptedPayload = CryptoJS.AES.encrypt(
      JSON.stringify({ email, password }),
      SECRET_KEY
    ).toString();

    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: encryptedPayload }),
      });

      const encrypted = await response.json();

      // 🔓 Decrypt response
      const bytes = CryptoJS.AES.decrypt(encrypted.data, SECRET_KEY);
      const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

      if (response.ok) {
        alert(decryptedData.message);

        localStorage.setItem('role', decryptedData.role);

        if (decryptedData.role === 'manager') {
          navigate('/view-projects');
        } else {
          navigate('/upload');
        }
      } else {
        alert(decryptedData.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="login-page">
      {/* ✅ Brand header */}
      <div className="brand-header">
        <h1>Project Match</h1>
        <p className="tagline">Connecting right people to the right projects.</p>
      </div>

      <div className="login-wrapper">
        <div className="login-left">
          <div className="login-form-box">
            <h2>Welcome back!</h2>
            <p>Enter your credentials to access your account</p>
            <form onSubmit={handleLogin}>
              <input type="email" name="email" placeholder="Email address" required />
              <input type="password" name="password" placeholder="Password" required />
              <div className="checkbox-group">
                <div className="remember-container">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <Link to="#">Forgot password?</Link>
              </div>
              <button type="submit">Login</button>
            </form>
            <div className="social-login">
              <button className="google">Sign in with Google</button>
              <button className="apple">Sign in with Apple</button>
            </div>
            <p className="signup-link">
              Don’t have an account? <Link to="/signup">Sign Up</Link>
            </p>
          </div>
        </div>
        <div className="login-right">
          <img src={illustration} alt="Illustration" />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
