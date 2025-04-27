import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation';

const Home = () => {
  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ background: 'linear-gradient(180deg, #0A0A1F 0%, #1A1A2F 100%)' }}>
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">Welcome to PulsePlus</h1>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Your complete fitness solution for tracking workouts, finding trainers, and achieving your wellness goals.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Link 
              to="/login"
              className="px-8 py-3 bg-[#f67a45] text-white rounded-full hover:bg-[#e56d3d] transition-colors font-medium text-lg"
            >
              Get Started
            </Link>
            <Link 
              to="/calculators"
              className="px-8 py-3 bg-transparent border border-white/30 text-white rounded-full hover:bg-white/10 transition-colors font-medium text-lg"
            >
              Try Our Calculators
            </Link>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-8 text-center">
            <div className="bg-[#f67a45]/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#f67a45]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Track Your Progress</h3>
            <p className="text-white/70">Monitor your fitness journey with detailed metrics and visualizations</p>
          </div>
          
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-8 text-center">
            <div className="bg-[#f67a45]/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#f67a45]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Personal Trainers</h3>
            <p className="text-white/70">Connect with expert trainers who will guide your fitness journey</p>
          </div>
          
          <div className="bg-[#121225] border border-[#f67a45]/30 rounded-lg p-8 text-center">
            <div className="bg-[#f67a45]/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#f67a45]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Store & Supplements</h3>
            <p className="text-white/70">Shop quality fitness equipment and supplements for optimal results</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
