import {
    Monitor, LogOut, Mail, Video, MessageCircle, ShoppingCart,
    Shield, Phone, Book, AlertTriangle, CheckCircle,
    Clock, ArrowRight, Bell, Users, Lock, TrendingUp, Sparkles
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../App";

export default function Dashboard({ user }) {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    // Mock data for progress and activities
    const userProgress = {
        completedLessons: 8,
        totalLessons: 24,
        streak: 5,
    };

    const tutorials = [
        {
            id: 1,
            title: "Email Basics",
            icon: Mail,
            description: "Learn to send, receive, and organize emails",
            progress: 60,
            lessons: 8,
            color: "blue"
        },
        {
            id: 2,
            title: "Video Calls",
            icon: Video,
            description: "Master Zoom, Skype, and FaceTime",
            progress: 30,
            lessons: 6,
            color: "purple"
        },
        {
            id: 3,
            title: "Social Media",
            icon: MessageCircle,
            description: "Connect with family on Facebook & Instagram",
            progress: 15,
            lessons: 10,
            color: "pink"
        },
        {
            id: 4,
            title: "Online Shopping",
            icon: ShoppingCart,
            description: "Shop safely on Amazon, eBay, and more",
            progress: 0,
            lessons: 7,
            color: "emerald"
        }
    ];

    const recentActivities = [
        {
            id: 1,
            title: "Completed: Setting up Gmail",
            time: "Today at 2:30 PM",
            icon: CheckCircle,
            color: "text-emerald-600 bg-emerald-50"
        },
        {
            id: 2,
            title: "Started: Making Your First Video Call",
            time: "Today at 1:15 PM",
            icon: Clock,
            color: "text-blue-600 bg-blue-50"
        },
        {
            id: 3,
            title: "Achievement: First Week Complete!",
            time: "Yesterday",
            icon: Sparkles,
            color: "text-amber-600 bg-amber-50"
        }
    ];

    return (
        <div className="min-h-screen bg-linear-to-b from-orange-50 via-orange-50 to-white">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
                    <div className="flex justify-between items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <Monitor className="w-8 h-8 text-gray-900" />
                            <span className="text-xl font-bold text-gray-900">TECHGUIDE</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <Bell className="w-6 h-6 text-gray-700" />
                                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">2</span>
                            </button>
                            <button
                                onClick={handleSignOut}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors text-sm font-semibold"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 pb-20">
                {/* Welcome Section */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-3">
                                Welcome Back
                            </h1>
                            {user?.email && (
                                <p className="text-xl text-gray-600">
                                    {user.email.split('@')[0]}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <div className="bg-white rounded-3xl shadow-md p-6 min-w-[140px] text-center hover:shadow-xl transition-shadow">
                                <div className="text-4xl font-black text-gray-900 mb-1">{userProgress.streak}</div>
                                <div className="text-sm font-semibold text-gray-600">Day Streak 🔥</div>
                            </div>
                            <div className="bg-white rounded-3xl shadow-md p-6 min-w-[140px] text-center hover:shadow-xl transition-shadow">
                                <div className="text-4xl font-black text-gray-900 mb-1">{userProgress.completedLessons}</div>
                                <div className="text-sm font-semibold text-gray-600">Lessons Done</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Courses */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Active Courses */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-3xl font-black text-gray-900">Your Courses</h2>
                                <button className="text-gray-600 hover:text-gray-900 font-semibold text-sm flex items-center gap-1">
                                    View All
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {tutorials.map((tutorial) => {
                                    const Icon = tutorial.icon;
                                    const hasProgress = tutorial.progress > 0;
                                    return (
                                        <div
                                            key={tutorial.id}
                                            className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${tutorial.color === 'blue' ? 'bg-blue-100' :
                                                    tutorial.color === 'purple' ? 'bg-purple-100' :
                                                        tutorial.color === 'pink' ? 'bg-pink-100' :
                                                            'bg-emerald-100'
                                                    }`}>
                                                    <Icon className={`w-7 h-7 ${tutorial.color === 'blue' ? 'text-blue-600' :
                                                        tutorial.color === 'purple' ? 'text-purple-600' :
                                                            tutorial.color === 'pink' ? 'text-pink-600' :
                                                                'text-emerald-600'
                                                        }`} />
                                                </div>
                                                {hasProgress && (
                                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                                                        In Progress
                                                    </span>
                                                )}
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{tutorial.title}</h3>
                                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{tutorial.description}</p>

                                            {hasProgress && (
                                                <div className="mb-4">
                                                    <div className="flex justify-between text-xs font-semibold mb-2">
                                                        <span className="text-gray-600">{tutorial.lessons} lessons</span>
                                                        <span className="text-gray-900">{tutorial.progress}% Complete</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${tutorial.color === 'blue' ? 'bg-blue-500' :
                                                                tutorial.color === 'purple' ? 'bg-purple-500' :
                                                                    tutorial.color === 'pink' ? 'bg-pink-500' :
                                                                        'bg-emerald-500'
                                                                }`}
                                                            style={{ width: `${tutorial.progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )}

                                            <button className="w-full py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group-hover:gap-3">
                                                {hasProgress ? 'Continue Learning' : 'Start Course'}
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-3xl shadow-sm p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                            <div className="space-y-4">
                                {recentActivities.map((activity) => {
                                    const Icon = activity.icon;
                                    return (
                                        <div key={activity.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${activity.color}`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-semibold text-gray-900 mb-1">{activity.title}</h3>
                                                <p className="text-sm text-gray-600">{activity.time}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Safety Alert */}
                        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
                            <div className="bg-red-500 px-6 py-4">
                                <div className="flex items-center gap-2 text-white">
                                    <AlertTriangle className="w-5 h-5" />
                                    <span className="font-bold text-sm uppercase tracking-wide">Safety Alert</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">New Scam Warning</h3>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    Be aware of fake IRS phone calls. The IRS will never call to demand immediate payment.
                                </p>
                                <button className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1">
                                    Learn More
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Quick Help */}
                        <div className="bg-emerald-500 rounded-3xl shadow-lg p-8 text-white text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Phone className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Need Help?</h3>
                            <p className="text-emerald-100 mb-6 text-sm">
                                Our support team is ready to assist you
                            </p>
                            <button className="w-full py-3 bg-white text-emerald-600 rounded-full font-bold hover:bg-emerald-50 transition-colors mb-3">
                                Call Support
                            </button>
                            <p className="text-xl font-bold text-white/90">(123) 456-7890</p>
                        </div>

                        {/* Community */}
                        <div className="bg-white rounded-3xl shadow-sm p-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Community</h3>
                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                Connect with other learners and share your journey
                            </p>
                            <div className="flex -space-x-2 mb-4">
                                <div className="w-10 h-10 bg-linear-to-br from-orange-400 to-rose-400 rounded-full border-2 border-white"></div>
                                <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-purple-400 rounded-full border-2 border-white"></div>
                                <div className="w-10 h-10 bg-linear-to-br from-emerald-400 to-teal-400 rounded-full border-2 border-white"></div>
                                <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-white flex items-center justify-center">
                                    <span className="text-xs font-bold text-gray-700">+52</span>
                                </div>
                            </div>
                            <button className="text-sm font-semibold text-gray-900 hover:text-gray-700 flex items-center gap-1">
                                Join Community
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Daily Tip */}
                        <div className="bg-blue-50 rounded-3xl shadow-sm p-6 border-2 border-blue-100">
                            <div className="flex items-start gap-3">
                                <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-1">💡 Today's Safety Tip</h4>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Always check the sender's email address before clicking any links.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
