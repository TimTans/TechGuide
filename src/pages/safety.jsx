import React from 'react';
import { AlertTriangle, Home, ArrowRight } from "lucide-react";
import { Link } from 'react-router-dom';
import DashboardNavbar from '../components/Navbar';

export default function Safety() {
    // Mock data for alert list
    const activeAlerts = [
        {
            id: 1,
            title: "IRS Phone Scam Warning",
            date: "Published: Today",
            summary: "The IRS will never call to demand immediate payment via gift card or wire transfer. Hang up and report the call."
        },
        {
            id: 2,
            title: "Fake Tech Support Pop-ups",
            date: "Published: 3 Days Ago",
            summary: "Never give remote access to your computer to someone who called you unexpectedly about a virus."
        },
        {
            id: 3,
            title: "Email Password Reset Scams",
            date: "Published: Last Week",
            summary: "Be suspicious of 'password reset' emails if you didn't request one. Check the sender's address carefully."
        },
    ];

    return (
        <div className="min-h-screen bg-linear-to-b from-orange-50 via-orange-50 to-white">
            <DashboardNavbar />
            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 pb-20">

                {/* Header/Breadcrumb */}
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1">
                        <Home className="w-4 h-4" /> Dashboard
                    </Link>
                    <span className="text-gray-400">/</span>
                    <h1 className="text-sm font-semibold text-red-700">Safety Alert Center</h1>
                </div>

                <div className="flex items-center gap-4 mb-10">
                    <AlertTriangle className="w-10 h-10 text-red-600" />
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900">
                        Safety Alert Center
                    </h1>
                </div>
                
                <p className="text-lg text-gray-600 max-w-4xl mb-12">
                    Stay informed about the latest online scams, fraud attempts, and safety tips to protect your personal information and finances. New alerts are posted weekly.
                </p>

                {/* Alerts List Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {activeAlerts.map(alert => (
                        <div key={alert.id} className="bg-white rounded-3xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow">
                            <div className="flex justify-between items-start mb-3">
                                <h2 className="text-xl font-bold text-gray-900">{alert.title}</h2>
                                <span className="text-xs font-medium text-gray-500 shrink-0">{alert.date}</span>
                            </div>
                            <p className="text-gray-600 mb-4 leading-relaxed">{alert.summary}</p>
                            
                            <button className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1">
                                Read Full Alert
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Additional Resources */}
                <div className="mt-16 pt-10 border-t border-gray-200">
                    <h2 className="text-3xl font-black text-gray-900 mb-6">Additional Safety Resources</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ResourceCard title="Internet Security Guide" description="Step-by-step guide to securing your home network and devices." />
                        <ResourceCard title="Phishing Prevention" description="Learn to spot malicious emails and deceptive websites." />
                        <ResourceCard title="Report a Scam" description="Official links and numbers to report fraud to federal agencies." />
                    </div>
                </div>

            </main>
        </div>
    );
}

// Simple resource card component
function ResourceCard({ title, description }) {
    return (
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600 mb-4">{description}</p>
            <button className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View Resource
                <ArrowRight className="w-3 h-3" />
            </button>
        </div>
    );
}