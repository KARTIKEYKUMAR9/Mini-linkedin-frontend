import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <nav className="bg-white shadow sticky top-0 z-50 w-screen">
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/home" className="text-2xl font-bold text-blue-600">MiniLinkedIn</Link>

        <div className="space-x-4">
          {user ? (
            <>
              <Link to={`/profile/${user.id}`} className="text-gray-700 hover:text-blue-600">{user.name}</Link>
              <button
                onClick={logout}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600">Login</Link>
              <Link to="/register" className="text-gray-700 hover:text-blue-600">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;