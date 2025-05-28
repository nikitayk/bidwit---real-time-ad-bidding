import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser } from 'react-icons/fi';
import { RiHeartsFill, RiSparklingFill } from 'react-icons/ri';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Clear any existing auth on mount
  useEffect(() => {
    localStorage.removeItem('user');
  }, []);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Add a small delay to prevent rapid form submissions
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      // Validate passwords match
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For development/demo purposes - always succeed
      const userData = {
        email,
        name,
        timestamp: new Date().toISOString()
      };
      
      // Set user data and navigate
      localStorage.setItem('user', JSON.stringify(userData));
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      localStorage.removeItem('user'); // Clear any partial auth state
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark flex items-center justify-center relative overflow-hidden px-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 text-neon-pink opacity-20 animate-float">
          <RiHeartsFill className="w-24 h-24" />
        </div>
        <div className="absolute bottom-10 right-10 text-neon-purple opacity-20 animate-float" style={{ animationDelay: '1s' }}>
          <RiHeartsFill className="w-16 h-16" />
        </div>
        <div className="absolute top-1/4 right-1/4 text-soft-pink opacity-20 animate-float" style={{ animationDelay: '2s' }}>
          <RiSparklingFill className="w-12 h-12" />
        </div>
        <div className="absolute bottom-1/4 left-1/4 text-soft-purple opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>
          <RiSparklingFill className="w-20 h-20" />
        </div>
      </div>

      {/* Grid overlay */}
      <div className="fixed inset-0 grid-lines pointer-events-none"></div>

      <div className="metric-card w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-wider text-neon-pink neon-text mb-2">
            BIDWIT
          </h1>
          <p className="text-soft-purple animate-shimmer">Where every bid tells a story</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6" noValidate>
          <div>
            <label className="block text-sm font-medium text-neon-pink mb-2 animate-shimmer">
              NAME
            </label>
            <div className="relative group">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-pink" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-cyber-darker border border-neon-pink/30 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-neon-pink focus:ring-1 focus:ring-neon-pink"
                placeholder="Enter your name"
                required
                autoComplete="name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neon-purple mb-2 animate-shimmer">
              EMAIL
            </label>
            <div className="relative group">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-purple" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-cyber-darker border border-neon-purple/30 rounded-lg pl-10 pr-4 py-2 text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple"
                placeholder="Enter your email"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neon-pink mb-2 animate-shimmer">
              PASSWORD
            </label>
            <div className="relative group">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-pink" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-cyber-darker border border-neon-pink/30 rounded-lg pl-10 pr-12 py-2 text-white focus:outline-none focus:border-neon-pink focus:ring-1 focus:ring-neon-pink"
                placeholder="Create a password"
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neon-pink hover:text-soft-pink"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neon-purple mb-2 animate-shimmer">
              CONFIRM PASSWORD
            </label>
            <div className="relative group">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neon-purple" />
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-cyber-darker border border-neon-purple/30 rounded-lg pl-10 pr-12 py-2 text-white focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple"
                placeholder="Confirm your password"
                required
                autoComplete="new-password"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-cyber-pink/10 border border-cyber-pink rounded-lg animate-shimmer">
              <p className="text-cyber-pink text-sm">{error}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <Link
              to="/login"
              className="text-sm text-soft-purple hover:text-neon-purple"
            >
              Already have an account? Sign in
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-gradient-sparkle text-white rounded-lg font-medium hover:animate-glow disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <RiSparklingFill className="animate-spin mr-2" />
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register; 