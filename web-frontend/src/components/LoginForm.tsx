import React, { useState } from 'react';
import axios from 'axios';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      const response = await axios.post('/api/auth/login', { email, password });

      if (response.data.success) {
        // Redirect or update UI on successful login
        console.log('Login successful:', response.data);
        window.location.href = '/dashboard';
      } else {
        setErrorMessage(response.data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);

      // Display backend-provided error message or fallback
      const message = axios.isAxiosError(error) && error.response?.data?.message
        ? error.response.data.message
        : 'An unexpected error occurred. Please try again.';
      setErrorMessage(message);
    }
  };

  return (
    <form onSubmit={handleLogin} className="login-form">
      <h2>Sign In</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <label htmlFor="email">Email</label>
      <input
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="password">Password</label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Sign In</button>
    </form>
  );
};

export default LoginForm;