import React from 'react';
import { Link } from 'react-router-dom';
import { RiHeartsFill, RiSparklingFill } from 'react-icons/ri';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-cyber-dark flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-neon-blue opacity-10 animate-float">
          <RiHeartsFill className="w-24 h-24" />
        </div>
        <div className="absolute bottom-10 right-10 text-neon-darkblue opacity-10 animate-float" style={{ animationDelay: '1s' }}>
          <RiHeartsFill className="w-16 h-16" />
        </div>
        <div className="absolute top-1/4 right-1/4 text-soft-blue opacity-10 animate-float" style={{ animationDelay: '2s' }}>
          <RiSparklingFill className="w-12 h-12" />
        </div>
        <div className="absolute bottom-1/4 left-1/4 text-soft-darkblue opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>
          <RiSparklingFill className="w-20 h-20" />
        </div>
      </div>

      {/* Grid overlay */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(0, 243, 255, 0.03) 1px, transparent 1px),
          linear-gradient(to right, rgba(0, 243, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
      }}></div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="text-neon-blue opacity-90">Bid</span>
          <span className="text-neon-darkblue opacity-90">Wit</span>
        </h1>
        <p className="text-lg md:text-xl text-soft-blue opacity-80 mb-8 max-w-2xl">
          Advanced real-time bidding analytics and optimization platform powered by AI
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/login"
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-neon-blue/70 to-neon-darkblue/70 text-white font-medium hover:from-neon-darkblue/80 hover:to-neon-blue/80 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-8 py-3 rounded-lg border-2 border-neon-blue/50 text-neon-blue/90 font-medium hover:bg-neon-blue/10 transition-all duration-300"
          >
            Register
          </Link>
        </div>
      </div>

      {/* Features grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-6xl mx-auto px-4">
        <div className="metric-card text-center">
          <RiSparklingFill className="w-12 h-12 text-neon-blue/70 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-neon-blue/80 mb-2">Real-Time Analytics</h3>
          <p className="text-soft-blue/90">Monitor your bidding performance with live updates and insights</p>
        </div>
        <div className="metric-card text-center">
          <RiHeartsFill className="w-12 h-12 text-neon-darkblue/70 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-neon-darkblue/80 mb-2">Smart Optimization</h3>
          <p className="text-soft-darkblue/90">AI-powered bid optimization for maximum ROI</p>
        </div>
        <div className="metric-card text-center">
          <RiSparklingFill className="w-12 h-12 text-neon-blue/70 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-neon-blue/80 mb-2">Advanced Reporting</h3>
          <p className="text-soft-blue/90">Comprehensive reports and visualizations for deep insights</p>
        </div>
      </div>
    </div>
  );
};

export default Landing; 