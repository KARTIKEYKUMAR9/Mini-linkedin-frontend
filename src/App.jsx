import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Profile from './pages/Profile';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

function App() {
//   useEffect(() => {
//   localStorage.removeItem("token"); // 🧹 Clear token every reload (dev only)
// }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path='/' element={<Navigate to="/register"/>} />

        <Route path="/register" element={<PublicRoute><Register/></PublicRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={
          <PrivateRoute><Home /></PrivateRoute>
        } />
        <Route path="/profile/:id" element={
          <PrivateRoute><Profile /></PrivateRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;