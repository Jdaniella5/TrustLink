// pages/LandingPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className=' bg-black h-screen flex justify-center items-center flex-col gap-10'>
      <h1 className='text-yellow-300 text-7xl text-center'>Welcome to Our App</h1>
      <Link to="/login" className='border-2 p-6 rounded-3xl border-amber-300 text-xl text-yellow-300'>
        <button >Get Started</button>
      </Link>
    </div>
  );
}