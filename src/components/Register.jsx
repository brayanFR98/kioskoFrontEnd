import React, { useState } from 'react';
import { registerUser } from '../services/api';
import Alerts from './Alerts';

const Register = ({ token }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { username, password } = formData;
    if (!username || !password) {
      Alerts('Por favor, completa todos los campos.', 'info');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return; // Salir si la validación falla
    }
    try {
      await registerUser(formData);
      Alerts('Usuario registrado exitosamente', 'success');
      setFormData({ username: '', password: '' });
    } catch (error) {
      Alerts('Error al registrar el usuario', 'error');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro</h2>
      <input type="text" name="username" placeholder="Nombre de usuario"  value={formData.username} onChange={handleChange} />
      <input type="password" name="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} />
      <button type="submit">Registrar</button>
    </form>
  );
};

export default Register;
