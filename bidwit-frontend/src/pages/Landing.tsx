import React, { useState } from 'react';
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
    description: 'Maximize your ROI with our intelligent campaign optimization tools.',
  },
];

const Landing: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="min-h-screen bg-dark-bg-primary text-dark-text-primary overflow-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-primary-600/20 to-blue-800/20 animate-gradient" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-24 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1
              className="text-6xl sm:text-7xl font-bold tracking-tight glow bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-primary-500"
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
              Where every bid tells a story
            </motion.p>
            
            {/* CTA Button */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Link
                to="/dashboard"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                Get Started
                <ArrowRightIcon
                  className={`ml-2 h-5 w-5 transition-transform duration-200 ${
                    isHovered ? 'transform translate-x-1' : ''
                  }`}
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-dark-bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-dark-text-primary sm:text-4xl">
              Powerful Features for Smart Bidding
            </h2>
            <p className="mt-4 text-xl text-dark-text-secondary">
              Everything you need to optimize your bidding strategy
            </p>
          </div>

          <div className="mt-12">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  className="pt-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flow-root bg-dark-bg-tertiary rounded-lg px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center p-3 bg-primary-500 rounded-md shadow-lg">
                          <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium text-dark-text-primary tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="mt-5 text-base text-dark-text-secondary">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing; 