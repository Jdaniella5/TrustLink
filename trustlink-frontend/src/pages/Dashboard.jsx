
import React, { useState } from 'react';
import { Home, Building2, CreditCard, FileText, User, Clock, LogOut, Menu, X, CheckCircle, Shield, Copy, Check, Camera, Mail, MapPin, Phone, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/apiUser';



const Dashboard = ({  userData }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [copiedId, setCopiedId] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);

  // User data with verification info - use prop or mock data
  const user = userData || {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+234 801 234 5678',
    address: '123 Victoria Island, Lagos, Nigeria',
    DOB: '1990-05-15',
    trustPassportId: 'TL-2024-89F3-X7K9',
    photoUrl: 'https://via.placeholder.com/150', // Replace with actual face verification photo
    verificationStatus: 'completed',
    trustScore: 850,
    verificationsCount: 12,
    reportsGenerated: 8,
    verifiedAt: '2024-12-01T10:30:00Z',
    kycDocuments: {
      nin: '12345678901',
      bvn: '22334455667',
      passport: 'A12345678'
    }
  };

  const banks = [
    { id: 'wema', name: 'Wema Bank', logo: '🏦' },
    { id: 'palmpay', name: 'PalmPay', logo: '💳' },
    { id: 'opay', name: 'OPay', logo: '💰' },
    { id: 'access', name: 'Access Bank', logo: '🏛️' },
    { id: 'gtbank', name: 'GTBank', logo: '🏦' },
    { id: 'zenith', name: 'Zenith Bank', logo: '🏢' },
    { id: 'firstbank', name: 'First Bank', logo: '🏦' },
    { id: 'uba', name: 'UBA', logo: '🏛️' }
  ];

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'bank-kyc', label: 'Bank KYC', icon: Building2 },
    { id: 'trustid', label: 'TrustID', icon: CreditCard },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'sessions', label: 'Sessions', icon: Clock },
  ];

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.trustPassportId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleBankSelect = (bank) => {
    setSelectedBank(bank);
    // Here you would typically call an API to copy user info to the selected bank
    setTimeout(() => {
      alert(`Your information has been sent to ${bank.name}`);
      setSelectedBank(null);
    }, 1500);
  };
  const navigate = useNavigate();
  const handlelogout = async () => {
    try {
      await logoutUser();
    } catch (error) {
      // Silently handle - 401 just means session already expired
      // which is fine for logout
    } finally {
      sessionStorage.removeItem('user');
      navigate('/login');
    }
  };
  

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-yellow-500 to-yellow-600 text-black transition-all duration-300 flex flex-col shadow-2xl`}>
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between border-b border-yellow-400">
          {sidebarOpen && <h1 className="text-2xl font-bold">TrustLink</h1>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-yellow-400 rounded-lg transition"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-3 hover:bg-yellow-400 transition ${
                  activeTab === item.id ? 'bg-black text-yellow-500 border-l-4 border-yellow-500 font-bold' : ''
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-yellow-400">
          <button
             onClick={handlelogout} 
            className="w-full flex items-center gap-4 px-6 py-3 hover:bg-yellow-400 rounded-lg transition"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-yellow-500 mb-2">
            Welcome Back, {user.name}
          </h1>
          <p className="text-gray-400">Your trusted identity dashboard</p>
        </div>

        {/* Verification Status Alert */}
        {user.verificationStatus === 'completed' && (
          <div className="mb-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg p-6 flex items-center gap-4 shadow-lg">
            <CheckCircle className="text-black" size={32} />
            <div>
              <h3 className="font-bold text-black text-lg">Fully Verified Account</h3>
              <p className="text-black text-sm">Your identity has been verified and your TrustPassport is active</p>
            </div>
          </div>
        )}

        {/* User Profile Card */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-2xl p-8 mb-8 border border-yellow-500">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Photo Section */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img 
                  src={user.photoUrl} 
                  alt="Profile" 
                  className="w-40 h-40 rounded-full border-4 border-yellow-500 object-cover shadow-lg"
                />
                <div className="absolute -bottom-2 -right-2 bg-yellow-500 rounded-full p-2">
                  <Camera className="text-black" size={20} />
                </div>
              </div>
              <div className="mt-4 text-center">
                <h2 className="text-2xl font-bold text-yellow-500">{user.name}</h2>
                <p className="text-gray-400 text-sm">Verified Member</p>
              </div>
            </div>

            {/* Info Section */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Email */}
              <div className="bg-black rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="text-yellow-500" size={18} />
                  <span className="text-gray-400 text-sm">Email</span>
                </div>
                <p className="text-white font-medium">{user.email}</p>
              </div>

              {/* Phone */}
              <div className="bg-black rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="text-yellow-500" size={18} />
                  <span className="text-gray-400 text-sm">Phone</span>
                </div>
                <p className="text-white font-medium">{user.phoneNumber}</p>
              </div>

              {/* Address */}
              <div className="bg-black rounded-lg p-4 border border-gray-700 md:col-span-2">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="text-yellow-500" size={18} />
                  <span className="text-gray-400 text-sm">Address</span>
                </div>
                <p className="text-white font-medium">{user.address}</p>
              </div>

              {/* DOB */}
              <div className="bg-black rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="text-yellow-500" size={18} />
                  <span className="text-gray-400 text-sm">Date of Birth</span>
                </div>
                <p className="text-white font-medium">{new Date(user.DOB).toLocaleDateString()}</p>
              </div>

              {/* TrustPassport ID */}
              <div className="bg-black rounded-lg p-4 border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="text-yellow-500" size={18} />
                  <span className="text-gray-400 text-sm">TrustPassport ID</span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-white font-bold font-mono">{user.trustPassportId}</p>
                  <button
                    onClick={handleCopyId}
                    className="p-1 hover:bg-yellow-500 hover:text-black rounded transition"
                  >
                    {copiedId ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-yellow-500" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Trust Score Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-xl p-6 border-t-4 border-yellow-500">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-500 p-3 rounded-lg">
                <Shield className="text-black" size={28} />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Trust Score</h3>
            <p className="text-5xl font-bold text-yellow-500 mb-2">{user.trustScore}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full" 
                  style={{ width: `${(user.trustScore / 1000) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-yellow-500 font-bold">Excellent</span>
            </div>
          </div>

          {/* Successfully Verified Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-xl p-6 border-t-4 border-yellow-500">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-500 p-3 rounded-lg">
                <CheckCircle className="text-black" size={28} />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Verifications</h3>
            <p className="text-5xl font-bold text-yellow-500 mb-2">{user.verificationsCount}</p>
            <p className="text-sm text-gray-400">Total completed</p>
          </div>

          {/* Reports Generated Card */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-xl p-6 border-t-4 border-yellow-500">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-500 p-3 rounded-lg">
                <FileText className="text-black" size={28} />
              </div>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">Reports</h3>
            <p className="text-5xl font-bold text-yellow-500 mb-2">{user.reportsGenerated}</p>
            <p className="text-sm text-gray-400">Generated</p>
          </div>
        </div>

        {/* Bank Selection Section */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-2xl p-8 border border-yellow-500">
          <h2 className="text-2xl font-bold text-yellow-500 mb-4 flex items-center gap-2">
            <Building2 size={28} />
            Connect to Your Preferred Bank
          </h2>
          <p className="text-gray-400 mb-6">Select a bank to share your verified information</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {banks.map((bank) => (
              <button
                key={bank.id}
                onClick={() => handleBankSelect(bank)}
                disabled={selectedBank?.id === bank.id}
                className={`bg-black border-2 border-gray-700 hover:border-yellow-500 rounded-lg p-6 transition transform hover:scale-105 ${
                  selectedBank?.id === bank.id ? 'border-yellow-500 opacity-50' : ''
                }`}
              >
                <div className="text-5xl mb-3">{bank.logo}</div>
                <p className="text-white font-semibold text-sm">{bank.name}</p>
                {selectedBank?.id === bank.id && (
                  <p className="text-yellow-500 text-xs mt-2">Sending...</p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg shadow-2xl p-6 border border-yellow-500">
          <h2 className="text-2xl font-bold text-yellow-500 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-4 bg-black rounded-lg border border-gray-700">
              <div className="bg-yellow-500 p-2 rounded-full">
                <CreditCard className="text-black" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Identity Verification Completed</p>
                <p className="text-sm text-gray-400">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-black rounded-lg border border-gray-700">
              <div className="bg-yellow-500 p-2 rounded-full">
                <Building2 className="text-black" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">Bank KYC Updated</p>
                <p className="text-sm text-gray-400">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-black rounded-lg border border-gray-700">
              <div className="bg-yellow-500 p-2 rounded-full">
                <FileText className="text-black" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">New Report Generated</p>
                <p className="text-sm text-gray-400">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;