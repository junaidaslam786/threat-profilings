import React, { useState } from 'react';
import Navbar from '../../components/Common/Navbar';

const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');

  const stats = [
    { label: 'Total Threats Detected', value: '1,247', change: '+12%', trend: 'up' },
    { label: 'Organizations Monitored', value: '89', change: '+5%', trend: 'up' },
    { label: 'Security Score', value: '94.2%', change: '+2.1%', trend: 'up' },
    { label: 'Incidents Resolved', value: '156', change: '-8%', trend: 'down' },
  ];

  const threatTypes = [
    { name: 'Malware', count: 423, percentage: 34 },
    { name: 'Phishing', count: 312, percentage: 25 },
    { name: 'DDoS', count: 198, percentage: 16 },
    { name: 'Data Breach', count: 156, percentage: 12 },
    { name: 'Other', count: 158, percentage: 13 },
  ];

  const recentAlerts = [
    { id: 1, type: 'Critical', message: 'Suspicious login attempt detected', time: '2 minutes ago', org: 'Acme Corp' },
    { id: 2, type: 'High', message: 'Malware signature found in email attachment', time: '15 minutes ago', org: 'TechStart Inc' },
    { id: 3, type: 'Medium', message: 'Unusual network traffic pattern', time: '1 hour ago', org: 'Global Systems' },
    { id: 4, type: 'Low', message: 'Failed authentication attempts', time: '2 hours ago', org: 'DataFlow Ltd' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-900 via-secondary-800 to-secondary-900 text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent mb-3">
            Analytics Dashboard
          </h1>
          <p className="text-secondary-300 text-lg">
            Monitor threats, track security metrics, and analyze platform performance
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <span className="text-secondary-300">Time Range:</span>
            {['24h', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white'
                    : 'bg-secondary-700/50 text-secondary-300 hover:text-white hover:bg-secondary-600/50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50 hover:border-primary-500/30 transition-all duration-300">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-secondary-400">{stat.label}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  stat.trend === 'up' 
                    ? 'bg-green-500/20 text-green-400' 
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="flex items-center">
                <svg className={`w-4 h-4 mr-1 ${stat.trend === 'up' ? 'text-green-400' : 'text-red-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.trend === 'up' ? 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6' : 'M13 17h8m0 0V9m0 8l-8-8-4 4-6-6'} />
                </svg>
                <span className="text-xs text-secondary-400">vs last period</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Threat Distribution */}
          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50">
            <h2 className="text-xl font-bold text-white mb-6">Threat Distribution</h2>
            <div className="space-y-4">
              {threatTypes.map((threat, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      index === 0 ? 'bg-red-500' :
                      index === 1 ? 'bg-orange-500' :
                      index === 2 ? 'bg-yellow-500' :
                      index === 3 ? 'bg-secondary-500' : 'bg-purple-500'
                    }`}></div>
                    <span className="text-white font-medium">{threat.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-secondary-300">{threat.count}</span>
                    <div className="w-20 bg-secondary-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          index === 0 ? 'bg-red-500' :
                          index === 1 ? 'bg-orange-500' :
                          index === 2 ? 'bg-yellow-500' :
                          index === 3 ? 'bg-secondary-500' : 'bg-purple-500'
                        }`}
                        style={{ width: `${threat.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-secondary-400 text-sm w-8">{threat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Score Trend */}
          <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50">
            <h2 className="text-xl font-bold text-white mb-6">Security Score Trend</h2>
            <div className="h-48 flex items-end justify-between space-x-2">
              {[85, 87, 89, 91, 88, 92, 94].map((score, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div 
                    className="w-8 bg-gradient-to-t from-primary-600 to-primary-400 rounded-t"
                    style={{ height: `${(score / 100) * 160}px` }}
                  ></div>
                  <span className="text-xs text-secondary-400 mt-2">{score}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Security Alerts */}
        <div className="bg-gradient-to-br from-secondary-800 to-secondary-900 rounded-xl p-6 border border-secondary-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Recent Security Alerts</h2>
            <button className="px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-500 hover:to-primary-600 transition-all duration-200 cursor-pointer">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-4 bg-secondary-700/30 rounded-lg border border-secondary-600/30 hover:border-secondary-500/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    alert.type === 'Critical' ? 'bg-red-500' :
                    alert.type === 'High' ? 'bg-orange-500' :
                    alert.type === 'Medium' ? 'bg-yellow-500' : 'bg-secondary-500'
                  }`}></div>
                  <div>
                    <p className="text-white font-medium">{alert.message}</p>
                    <p className="text-sm text-secondary-400">{alert.org} • {alert.time}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  alert.type === 'Critical' ? 'bg-red-500/20 text-red-400' :
                  alert.type === 'High' ? 'bg-orange-500/20 text-orange-400' :
                  alert.type === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-secondary-500/20 text-secondary-400'
                }`}>
                  {alert.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;