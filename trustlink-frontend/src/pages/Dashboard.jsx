import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const Dashboard = ({ user, onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ Redirect immediately if user is missing or not verified
    if (!user || user.verificationStatus !== 'completed') {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  const handleLogout = () => {
    // ✅ Call parent logout handler (clears user + storage)
    onLogout();
    // ✅ Redirect immediately for a smooth experience
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">
        Welcome to TrustLink 
      </h1>

      <p className="text-gray-600 mb-8">
        Verification completed ✅ — your trust score is{' '}
        <b>{user?.trustScore || 'N/A'}</b>.
      </p>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        <LogOut size={20} />
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
