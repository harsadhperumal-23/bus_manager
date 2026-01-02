import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Award } from 'lucide-react';
import { getOnTimePerformanceData, getRouteData, generateAIInsights } from '../services/mockDataService';

const Analytics = () => {
    const [performanceData, setPerformanceData] = useState([]);
    const [routeData, setRouteData] = useState([]);
    const [insights, setInsights] = useState([]);

    useEffect(() => {
        setPerformanceData(getOnTimePerformanceData());
        setRouteData(getRouteData());
        setInsights(generateAIInsights());
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white light:text-slate-900 mb-2">Analytics Dashboard</h1>
                <p className="text-slate-400 light:text-slate-600">Performance insights and trends</p>
            </div>

            {/* AI Insights */}
            <div className="glass-card rounded-xl p-6">
                <h2 className="text-xl font-bold text-white light:text-slate-900 mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6 text-emerald-400" />
                    AI-Generated Insights
                </h2>
                <div className="space-y-2">
                    {insights.map((insight, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-white/5 light:bg-slate-100 rounded-lg">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2"></div>
                            <p className="text-slate-300 light:text-slate-700">{insight}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* On-Time Performance Chart */}
            <div className="glass-card rounded-xl p-6">
                <h2 className="text-xl font-bold text-white light:text-slate-900 mb-4">
                    24-Hour On-Time Performance
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="hour" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                            labelStyle={{ color: '#f1f5f9' }}
                        />
                        <Legend />
                        <Line type="monotone" dataKey="performance" stroke="#10b981" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Route Performance */}
            <div className="glass-card rounded-xl p-6">
                <h2 className="text-xl font-bold text-white light:text-slate-900 mb-4">
                    Route Performance Comparison
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={routeData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                        <XAxis dataKey="route" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                            labelStyle={{ color: '#f1f5f9' }}
                        />
                        <Legend />
                        <Bar dataKey="efficiency" fill="#3b82f6" />
                        <Bar dataKey="revenue" fill="#10b981" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Analytics;
