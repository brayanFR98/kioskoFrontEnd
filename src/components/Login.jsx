import React, { useState } from 'react';
import { loginUser } from '../services/api';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Alerts from './Alerts';

const Login = ({ setToken }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      setToken(response.data.token);
      navigate('/feeds');
    } catch (error) {
      Alerts('Error al iniciar sesión', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input type="text" name="username" placeholder="Username" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      <button type="submit">Login</button>
    </form>
  );


}

export default Login;


