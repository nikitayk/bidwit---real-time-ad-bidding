import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, ScatterChart, Scatter } from 'recharts';
import { Upload, Activity, TrendingUp, Target, Play, Pause, BarChart3, PieChart as PieChartIcon, TrendingUp as LineChartIcon } from 'lucide-react';

const BidwitDashboard = () => {
  const [data, setData] = useState([]);
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [liveData, setLiveData] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedChart, setSelectedChart] = useState('ctr');

  // Process data for visualizations
  const processedData = useMemo(() => {
    if (!data.length) return { ctrData: [], bidData: [], winData: [] };

    // Sample data for performance (take every nth item for large datasets)
    const sampleSize = Math.min(1000, data.length);
    const step = Math.max(1, Math.floor(data.length / sampleSize));
    const sampledData = data.filter((_, i) => i % step === 0);

    // CTR over time
    const ctrData = sampledData.map((item, index) => ({
      index,
      ctr: parseFloat(item.ctr) * 100,
      timestamp: new Date(parseInt(item.timestamp)).toLocaleTimeString()
    }));

    // Bid price distribution
    const bidRanges = { '0-1': 0, '1-2': 0, '2-5': 0, '5-10': 0, '10+': 0 };
    const bidScatter = [];
    
    sampledData.forEach((item, index) => {
      const bid = parseFloat(item.bid_price);
      if (bid < 1) bidRanges['0-1']++;
      else if (bid < 2) bidRanges['1-2']++;
      else if (bid < 5) bidRanges['2-5']++;
      else if (bid < 10) bidRanges['5-10']++;
      else bidRanges['10+']++;
      
      bidScatter.push({ x: index, y: bid, ctr: parseFloat(item.ctr) });
    });

    const bidData = Object.entries(bidRanges).map(([range, count]) => ({
      range,
      count,
      percentage: ((count / sampledData.length) * 100).toFixed(1)
    }));

    // Win/Loss distribution
    const winCounts = { won: 0, lost: 0 };
    sampledData.forEach(item => {
      if (item.win_status === '1') winCounts.won++;
      else winCounts.lost++;
    });

    const winData = [
      { name: 'Won', value: winCounts.won, color: '#10B981' },
      { name: 'Lost', value: winCounts.lost, color: '#EF4444' }
    ];

    return { ctrData, bidData, winData, bidScatter };
  }, [data]);

  // Calculate dashboard metrics
  const metrics = useMemo(() => {
    if (!data.length) return { avgCtr: 0, totalBids: 0, bidsWon: 0, bidsLost: 0, winRate: 0 };

    const totalBids = data.length;
    const bidsWon = data.filter(item => item.win_status === '1').length;
    const bidsLost = totalBids - bidsWon;
    const avgCtr = data.reduce((sum, item) => sum + parseFloat(item.ctr), 0) / totalBids;
    const winRate = (bidsWon / totalBids) * 100;

    return { avgCtr, totalBids, bidsWon, bidsLost, winRate };
  }, [data]);

  // File upload handler
  const handleFileUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const text = await file.text();
      const lines = text.trim().split('\n');
      const parsedData = [];

      // Simulate progress for large files
      const chunkSize = 1000;
      for (let i = 0; i < lines.length; i += chunkSize) {
        const chunk = lines.slice(i, i + chunkSize);
        chunk.forEach(line => {
          const [timestamp, ad_id, bid_price, ctr, win_status] = line.split(',');
          if (timestamp && ad_id && bid_price && ctr && win_status) {
            parsedData.push({ timestamp, ad_id, bid_price, ctr, win_status });
          }
        });
        
        setUploadProgress((i / lines.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 10)); // Small delay for UI update
      }

      setData(parsedData);
      setUploadProgress(100);
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    } catch (error) {
      console.error('Error parsing file:', error);
      setIsUploading(false);
    }
  }, []);

  // Live mode simulation
  useEffect(() => {
    if (!isLiveMode) return;

    const interval = setInterval(() => {
      const newEntry = {
        timestamp: Date.now(),
        ctr: (Math.random() * 0.1).toFixed(4),
        bid_price: (Math.random() * 10).toFixed(2),
        win_status: Math.random() > 0.7 ? '1' : '0'
      };
      
      setLiveData(prev => [...prev.slice(-50), newEntry]);
    }, 1000);

    // Auto-stop after 1 minute
    const timeout = setTimeout(() => {
      setIsLiveMode(false);
    }, 60000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [isLiveMode]);

  const chartOptions = [
    { id: 'ctr', name: 'CTR Trend', icon: LineChartIcon },
    { id: 'bid', name: 'Bid Distribution', icon: BarChart3 },
    { id: 'win', name: 'Win/Loss', icon: PieChartIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Bidwit Dashboard
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* File Upload */}
            <label className="relative cursor-pointer">
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
              />
              <div className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload Data</span>
              </div>
            </label>

            {/* Live Mode Toggle */}
            <button
              onClick={() => setIsLiveMode(!isLiveMode)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                isLiveMode 
                  ? 'bg-red-600 hover:bg-red-700' 
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {isLiveMode ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isLiveMode ? 'Stop Live' : 'Start Live'}</span>
            </button>
          </div>
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="mt-4">
            <div className="bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <p className="text-sm text-gray-400 mt-1">Uploading... {uploadProgress.toFixed(0)}%</p>
          </div>
        )}
      </div>

      {/* Metrics Cards */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Average CTR</p>
                <p className="text-2xl font-bold text-blue-400">{(metrics.avgCtr * 100).toFixed(2)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Bids</p>
                <p className="text-2xl font-bold text-purple-400">{metrics.totalBids.toLocaleString()}</p>
              </div>
              <Target className="w-8 h-8 text-purple-400" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Bids Won</p>
                <p className="text-2xl font-bold text-green-400">{metrics.bidsWon.toLocaleString()}</p>
              </div>
              <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-gray-900 font-bold text-sm">W</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Bids Lost</p>
                <p className="text-2xl font-bold text-red-400">{metrics.bidsLost.toLocaleString()}</p>
              </div>
              <div className="w-8 h-8 bg-red-400 rounded-full flex items-center justify-center">
                <span className="text-gray-900 font-bold text-sm">L</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Win Rate</p>
                <p className="text-2xl font-bold text-yellow-400">{metrics.winRate.toFixed(1)}%</p>
              </div>
              <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-gray-900 font-bold text-sm">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Updates */}
        {isLiveMode && liveData.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse" />
              Live Updates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {liveData.slice(-3).map((item, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4 animate-fadeIn">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.win_status === '1' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white'
                    }`}>
                      {item.win_status === '1' ? 'WON' : 'LOST'}
                    </span>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm">CTR: {(parseFloat(item.ctr) * 100).toFixed(2)}%</p>
                    <p className="text-sm">Bid: ${item.bid_price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          {/* Chart Navigation */}
          <div className="flex space-x-4 mb-6">
            {chartOptions.map(option => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedChart(option.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedChart === option.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{option.name}</span>
                </button>
              );
            })}
          </div>

          {/* Chart Content */}
          <div className="h-96">
            {selectedChart === 'ctr' && processedData.ctrData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={processedData.ctrData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="index" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ctr" 
                    stroke="#3B82F6" 
                    strokeWidth={2}
                    dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}

            {selectedChart === 'bid' && processedData.bidData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={processedData.bidData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="range" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="count" fill="#8B5CF6" />
                </BarChart>
              </ResponsiveContainer>
            )}

            {selectedChart === 'win' && processedData.winData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={processedData.winData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {processedData.winData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}

            {!data.length && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Upload className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Upload your data file to see visualizations</p>
                  <p className="text-gray-500 text-sm">Supports files up to 2M rows</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BidwitDashboard;