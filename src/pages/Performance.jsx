import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Activity, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const Performance = () => {
    const [performanceData] = useState([
        { time: '6:00', onTime: 95, delayed: 5 },
        { time: '9:00', onTime: 88, delayed: 12 },
        { time: '12:00', onTime: 92, delayed: 8 },
        { time: '15:00', onTime: 85, delayed: 15 },
        { time: '18:00', onTime: 78, delayed: 22 },
        { time: '21:00', onTime: 90, delayed: 10 },
    ]);

    const stats = [
        { label: 'On-Time Rate', value: '89%', icon: CheckCircle, color: 'text-emerald-400' },
        { label: 'Avg Delay', value: '8 min', icon: Clock, color: 'text-orange-400' },
        { label: 'Fleet Efficiency', value: '94%', icon: Activity, color: 'text-blue-400' },
        { label: 'Daily Trend', value: '+5.2%', icon: TrendingUp, color: 'text-emerald-400' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white light:text-slate-900 mb-2">Performance Metrics</h1>
                <p className="text-slate-400 light:text-slate-600">Track fleet performance and efficiency</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <div key={index} className="glass-card rounded-xl p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 light:bg-slate-100 rounded-lg flex items-center justify-center">
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400 light:text-slate-600">{stat.label}</p>
                                <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Performance Chart */}
            <div className="glass-card rounded-xl p-6">
                <h2 className="text-xl font-bold text-white light:text-slate-900 mb-4">
                    Daily Performance Trend
                </h2>
                <ResponsiveContainer width="100%" height={400}>
                    <AreaChart data={performanceData}>
                        <defs>
                            <linearGradient id="onTime" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="delayed" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="time" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                            labelStyle={{ color: '#f1f5f9' }}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="onTime" stroke="#10b981" fillOpacity={1} fill="url(#onTime)" />
                        <Area type="monotone" dataKey="delayed" stroke="#f59e0b" fillOpacity={1} fill="url(#delayed)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Performance;
