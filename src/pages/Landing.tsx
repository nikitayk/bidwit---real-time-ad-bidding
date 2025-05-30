import React from 'react';
import { Link } from 'react-router-dom';
import { RiHeartsFill, RiSparklingFill } from 'react-icons/ri';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-cyber-dark flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-neon-blue opacity-20 animate-float">
          <RiHeartsFill className="w-24 h-24" />
        </div>
        <div className="absolute bottom-10 right-10 text-neon-darkblue opacity-20 animate-float" style={{ animationDelay: '1s' }}>
          <RiHeartsFill className="w-16 h-16" />
        </div>
        <div className="absolute top-1/4 right-1/4 text-soft-blue opacity-20 animate-float" style={{ animationDelay: '2s' }}>
          <RiSparklingFill className="w-12 h-12" />
        </div>
        <div className="absolute bottom-1/4 left-1/4 text-soft-darkblue opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>
          <RiSparklingFill className="w-20 h-20" />
        </div>
      </div>

      {/* Grid overlay */}
      <div className="fixed inset-0 grid-lines pointer-events-none"></div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        <h1 className="text-6xl md:text-8xl font-bold tracking-wider text-neon-blue neon-text mb-6">
          BIDWIT
        </h1>
        <p className="text-xl md:text-2xl text-soft-darkblue animate-shimmer mb-12">
          Where every bid tells a story
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
          <Link
            to="/login"
            className="px-8 py-3 bg-gradient-sparkle text-white rounded-lg font-medium hover:animate-glow transition-all duration-300 min-w-[200px]"
            onClick={(e) => {
              e.preventDefault();
              localStorage.removeItem('user');
              window.location.href = '/login';
            }}
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-8 py-3 border border-neon-darkblue text-neon-darkblue rounded-lg font-medium hover:bg-neon-darkblue/10 hover:animate-glow transition-all duration-300 min-w-[200px]"
            onClick={(e) => {
              e.preventDefault();
              localStorage.removeItem('user');
              window.location.href = '/register';
            }}
          >
            Create Account
          </Link>
        </div>
      </div>

      {/* Features section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto px-4">
        <div className="metric-card text-center">
          <RiSparklingFill className="w-12 h-12 text-neon-blue mx-auto mb-4" />
          <h3 className="text-xl font-bold text-neon-blue mb-2">Real-Time Analytics</h3>
          <p className="text-soft-blue">Monitor your bidding performance with live updates and insights</p>
        </div>
        <div className="metric-card text-center">
          <RiHeartsFill className="w-12 h-12 text-neon-darkblue mx-auto mb-4" />
          <h3 className="text-xl font-bold text-neon-darkblue mb-2">Smart Optimization</h3>
          <p className="text-soft-darkblue">AI-powered bid optimization for maximum ROI</p>
        </div>
        <div className="metric-card text-center">
          <RiSparklingFill className="w-12 h-12 text-neon-blue mx-auto mb-4" />
          <h3 className="text-xl font-bold text-neon-blue mb-2">Advanced Reporting</h3>
          <p className="text-soft-blue">Comprehensive reports and visualizations for deep insights</p>
        </div>
      </div>
    </div>
  );
};

export default Landing; 