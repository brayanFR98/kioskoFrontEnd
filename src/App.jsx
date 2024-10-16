// export default App;
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import FeedList from './components/FeedList';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
  };

  return (
    <div>
      <nav>
        {token && (
          <ul className='flex'>
            <li className='bg-blue-400 rounded-md flex text-center p-3 m-4'>
              <a href="/register" className='text-white'>Register</a>
            </li>
            <li className='bg-blue-400 rounded-md flex text-center p-3 m-4'>
              <a href="/feeds" className='text-white'>Feeds</a>
            </li>
            <li className='rounded-md flex text-center'>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        )}
      </nav>

      <Routes>

        <Route
          path="/login"
          element={token ? <Navigate to="/feeds" /> : <Login setToken={setToken} />}
        />

        <Route
          path="/"
          element={token ? <Navigate to="/feeds" /> : <Navigate to="/login" />}
        />

        <Route
          path="/register"
          element={token ?
            <PrivateRoute>
              <Register token={token} />
            </PrivateRoute> :
            <Navigate to="/login" />}
        />

        <Route
          path="/feeds"
          element={token ?
            <PrivateRoute>
              <FeedList token={token} />
            </PrivateRoute> :
            <Navigate to="/login" />}
        />

        <Route
          path="/*"
          element={token ? <Navigate to="/feeds" /> : <Navigate to="/login" />}
        />

      </Routes>
    </div>
  );
};

export default App;