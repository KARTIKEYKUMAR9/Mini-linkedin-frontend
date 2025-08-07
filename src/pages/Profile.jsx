import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/users/${id}`);
      setUser(res.data.user);
      setPosts(res.data.posts);
    } catch (err) {
      console.error('Failed to load profile');
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  if (!user) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="bg-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Profile Card */}
        <div className="bg-white p-6 rounded shadow text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.name}</h2>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-gray-700 mt-2">{user.bio}</p>
          
        </div>

        {/* Posts Header */}
        <h3 className="text-xl font-semibold text-gray-800">Posts by {user.name}</h3>

        {/* Posts List */}
        {posts.length === 0 ? (
          <p className="text-gray-600">No posts from this user yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="bg-white p-5 rounded shadow">
              <p className="text-gray-800 mb-2">{post.content}</p>
              <div className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Profile;