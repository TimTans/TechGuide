import {
    Mail, Video, MessageCircle, ShoppingCart, Phone, AlertTriangle, CheckCircle,
    Clock, ArrowRight, Users, Lock, Sparkles
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { UserAuth, supabase } from "../context/AuthContext";
import { useEffect, useState } from "react";
import DashboardNavbar from "../components/Navbar";
import UserCourses from "../components/UserCourses";

export default function Dashboard() {
    const navigate = useNavigate();
    const { session, getUserData } = UserAuth();
    const user = session?.user;
    const [userData, setUserData] = useState(null);
    const [userProgress, setUserProgress] = useState({
        completedLessons: 0,
        totalLessons: 0,
        streak: 0,
    });
    const [loadingProgress, setLoadingProgress] = useState(true);

    // Redirect to signin if not authenticated
    useEffect(() => {
        if (session === null) {
            navigate("/signin");
        } else if (session?.user) {
            getUserData().then((res) => {
                if (res.success) {
                    setUserData(res.data);
                }
            });
        }
    }, [session, navigate]);

    // Fetch user progress stats
    useEffect(() => {
        const fetchProgressStats = async () => {
            if (!session?.user) {
                setLoadingProgress(false);
                return;
            }

            try {
                const userId = session.user.id;

                // Fetch all tutorials count
                const { count: totalTutorials, error: tutorialsError } = await supabase
                    .from("tutorials")
                    .select("*", { count: "exact", head: true });

                if (tutorialsError) {
                    console.error("Error fetching tutorials count:", tutorialsError);
                }

                // Fetch user progress
                const { data: progressData, error: progressError } = await supabase
                    .from("user_progress")
                    .select("completed_at")
                    .eq("user_id", userId);

                if (progressError) {
                    console.error("Error fetching user progress:", progressError);
                }

                // Calculate completed tutorials
                const completedTutorials = (progressData || []).filter(
                    p => p.completed_at !== null
                ).length;

                // Calculate streak (simplified - you can enhance this later)
                // For now, we'll use a simple calculation based on recent activity
                const recentProgress = (progressData || []).filter(p => {
                    if (!p.completed_at) return false;
                    const completedDate = new Date(p.completed_at);
                    const daysSince = (Date.now() - completedDate.getTime()) / (1000 * 60 * 60 * 24);
                    return daysSince <= 7; // Active in last 7 days
                });
                const streak = Math.min(recentProgress.length, 7); // Cap at 7 for now

                setUserProgress({
                    completedLessons: completedTutorials,
                    totalLessons: totalTutorials || 0,
                    streak: streak || 0,
                });
            } catch (error) {
                console.error("Unexpected error fetching progress stats:", error);
            } finally {
                setLoadingProgress(false);
            }
        };

        if (session) {
            fetchProgressStats();
        }
    }, [session]);

    // Show loading or nothing while checking auth
    if (session === null) {
        return null;
    }

    // Calculation for progress bar
    const progressPercentage = userProgress.totalLessons > 0
        ? Math.round((userProgress.completedLessons / userProgress.totalLessons) * 100)
        : 0;


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
            <DashboardNavbar />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 pb-20">
                {/* Welcome Section */}
                <div className="mb-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                        <div>
                            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-3">
                                Welcome Back{userData?.first_name ? `, ${userData.first_name}` : ''}
                            </h1>
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

                {/* Progress Bar */}
                <div className="lg:col-span-3 bg-white rounded-3xl shadow-lg p-6 md:p-8 border border-gray-100 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900">
                            Your Learning Progress
                        </h3>
                        <span className="text-2xl font-black text-emerald-600">
                            {progressPercentage}%
                        </span>
                    </div>
                    {/* The Progress Bar Container */}
                    <div className="w-full bg-gray-200 rounded-full h-3">
                        {/* The Progress Bar Fill */}
                        <div
                            className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-3">
                        {userProgress.completedLessons} of {userProgress.totalLessons} lessons completed. Keep going!
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Courses */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Active Courses */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-3xl font-black text-gray-900">Your Courses</h2>
                                <Link to="/allcourses">
                                    <button className="text-gray-600 hover:text-gray-900 font-semibold text-sm flex items-center gap-1">
                                        View All
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                            <UserCourses />
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
                                <Link to="/safety">
                                    <button className="text-sm font-semibold text-red-600 hover:text-red-700 flex items-center gap-1">
                                        Learn More
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>
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
