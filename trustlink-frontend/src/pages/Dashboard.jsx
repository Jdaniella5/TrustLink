import React, { useState, useEffect } from 'react';
import { Home, Building2, IdCard, FileText, User, Clock, LogOut, Menu, X, CheckCircle, Shield } from 'lucide-react';

const Dashboard = ({ onLogout}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  
  // Mock user data - replace with actual user prop
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    verificationStatus: 'completed',
    trustScore: 850,
    verificationsCount: 12,
    reportsGenerated: 8
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'bank-kyc', label: 'Bank KYC', icon: Building2 },
    { id: 'trustid', label: 'TrustID', icon: IdCard },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'sessions', label: 'Sessions', icon: Clock },
  ];

  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-blue-600 text-white transition-all duration-300 flex flex-col`}>
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between border-b border-blue-500">
          {sidebarOpen && <h1 className="text-2xl font-bold">TrustLink</h1>}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-blue-500 rounded-lg transition"
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
                className={`w-full flex items-center gap-4 px-6 py-3 hover:bg-blue-500 transition ${
                  activeTab === item.id ? 'bg-blue-700 border-l-4 border-white' : ''
                }`}
              >
                <Icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-6 border-t border-blue-500">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-6 py-3 hover:bg-blue-500 rounded-lg transition"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome {user.name},
          </h1>
          <p className="text-gray-600">to your TrustLink Dashboard</p>
        </div>

        {/* Verification Status Alert */}
        {user.verificationStatus === 'completed' && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="text-green-600" size={24} />
            <div>
              <h3 className="font-semibold text-green-800">You have been verified!</h3>
              <p className="text-green-700 text-sm">Your account verification is complete and active.</p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Trust Score Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-600">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Shield className="text-blue-600" size={28} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Trust Score</h3>
            <p className="text-4xl font-bold text-gray-800 mb-2">{user.trustScore}</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(user.trustScore / 1000) * 100}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">Excellent</span>
            </div>
          </div>

          {/* Successfully Verified Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-green-600">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="text-green-600" size={28} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Successfully Verified</h3>
            <p className="text-4xl font-bold text-gray-800 mb-2">{user.verificationsCount}</p>
            <p className="text-sm text-gray-500">Total verifications completed</p>
          </div>

          {/* Reports Generated Card */}
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-600">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <FileText className="text-purple-600" size={28} />
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Reports Generated</h3>
            <p className="text-4xl font-bold text-gray-800 mb-2">{user.reportsGenerated}</p>
            <p className="text-sm text-gray-500">Total reports created</p>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-full">
                <IdCard className="text-blue-600" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Identity Verification Completed</p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-full">
                <Building2 className="text-green-600" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">Bank KYC Updated</p>
                <p className="text-sm text-gray-500">1 day ago</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className="bg-purple-100 p-2 rounded-full">
                <FileText className="text-purple-600" size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-800">New Report Generated</p>
                <p className="text-sm text-gray-500">3 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;