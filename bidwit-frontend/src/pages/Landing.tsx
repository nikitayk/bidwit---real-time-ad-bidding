import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  CogIcon,
  BoltIcon,
  RocketLaunchIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';

const features = [
  {
    icon: ChartBarIcon,
    title: 'Real-Time Analytics',
    description: 'Monitor your bidding performance with live updates and comprehensive analytics.',
  },
  {
    icon: BoltIcon,
    title: 'Lightning Fast',
    description: 'Process millions of bid records in seconds with our optimized data engine.',
  },
  {
    icon: CogIcon,
    title: 'Smart Automation',
    description: 'AI-powered bidding strategies that adapt to market conditions.',
  },
  {
    icon: RocketLaunchIcon,
    title: 'Campaign Optimization',
    description: 'Maximize ROI with intelligent bid adjustments and performance insights.',
  },
];

function Landing() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-dark-bg-primary text-dark-text-primary overflow-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-purple-900/20 to-pink-900/20 animate-gradient" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1
              className="text-6xl sm:text-7xl font-bold tracking-tight glow bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-pink-400"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
            >
              BIDWIT
            </motion.h1>
            <motion.p
              className="mt-6 text-xl sm:text-2xl text-dark-text-secondary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Where every bid tells a story :)
            </motion.p>
            <motion.div
              className="mt-10 flex justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                to="/login"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-medium smooth-transition"
              >
                Get Started
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 rounded-lg border border-primary-500 text-primary-400 hover:bg-primary-500/10 font-medium smooth-transition"
              >
                Sign Up
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="relative p-6 bg-dark-bg-secondary rounded-lg shadow-lg hover-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
            >
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary-500/20 to-pink-500/20 rounded-full blur-xl" />
              <div className="relative">
                <feature.icon className="h-8 w-8 text-primary-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-dark-text-secondary">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-dark-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-primary-400 mb-2">2M+</div>
              <div className="text-dark-text-secondary">Bids Processed Daily</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-4xl font-bold text-primary-400 mb-2">99.9%</div>
              <div className="text-dark-text-secondary">Uptime</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="text-4xl font-bold text-primary-400 mb-2">45%</div>
              <div className="text-dark-text-secondary">Average ROI Increase</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="text-4xl font-bold text-primary-400 mb-2">24/7</div>
              <div className="text-dark-text-secondary">Real-Time Monitoring</div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Landing; 