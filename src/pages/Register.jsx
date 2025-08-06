import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', bio: '' });
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Create Account</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input name="name" onChange={handleChange} required className="w-full border p-2 rounded border-gray-400 bg-gray-200 text-black" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input name="email" type="email" onChange={handleChange} required className="w-full border p-2 rounded border-gray-400 bg-gray-200 text-black" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input name="password" type="password" onChange={handleChange} required className="w-full border p-2 rounded border-gray-400 bg-gray-200 text-black" />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">Bio</label>
            <textarea name="bio" rows="3" onChange={handleChange} className="w-full border p-2 rounded border-gray-400 bg-gray-200 text-black" />
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Register;