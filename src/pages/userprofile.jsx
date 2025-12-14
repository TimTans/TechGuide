import {
    User, Mail, Calendar, Award, BookOpen, Clock, TrendingUp,
    Target, Star, CheckCircle, Edit, Camera, Sparkles, Trophy,
    Activity, BarChart3
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth, supabase } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function UserProfile() {
    const navigate = useNavigate();
    const { session, getUserData } = UserAuth();
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [profileStats, setProfileStats] = useState({
        coursesCompleted: 0,
        hoursSpent: 0,
        currentStreak: 0,
        totalPoints: 0,
        joinDate: "",
        rank: "Beginner"
    });
    const [achievements, setAchievements] = useState([]);
    const [activeCourses, setActiveCourses] = useState([]);
    const [learningStats, setLearningStats] = useState([]);
    const [weeklyActivity, setWeeklyActivity] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRankPopup, setShowRankPopup] = useState(false);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const rankButtonRef = useRef(null);
    const [sessionChecked, setSessionChecked] = useState(false);

    // Wait for initial session check to complete
    useEffect(() => {
        // Check session after a brief delay to allow it to load
        const checkSession = async () => {
            // Wait a bit for session to initialize
            await new Promise(resolve => setTimeout(resolve, 150));
            setSessionChecked(true);
        };
        checkSession();
    }, []);

    // Redirect to signin if not authenticated (only after session has been checked)
    useEffect(() => {
        if (sessionChecked && session === null) {
            navigate("/signin");
        }
    }, [session, sessionChecked, navigate]);

    // Fetch user data and profile stats
    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!session?.user) return;

            try {
                setLoading(true);
                const userId = session.user.id;

                // Fetch user data
                const userRes = await getUserData();
                if (userRes.success) {
                    setUserData(userRes.data);
                }

                // Fetch all tutorials with their durations
                const { data: tutorialsData, error: tutorialsError } = await supabase
                    .from("tutorials")
                    .select("tutorial_id, estimated_duration, category_id, title");

                if (tutorialsError) {
                    console.error("Error fetching tutorials:", tutorialsError);
                }

                // Fetch user progress
                const { data: progressData, error: progressError } = await supabase
                    .from("user_progress")
                    .select("tutorial_id, completed_at, started_at, status")
                    .eq("user_id", userId);

                if (progressError) {
                    console.error("Error fetching progress:", progressError);
                }

                // Calculate completed tutorials
                const completedProgress = (progressData || []).filter(
                    p => p.completed_at !== null
                );

                // Calculate hours spent from completed tutorials
                const completedTutorialIds = new Set(completedProgress.map(p => p.tutorial_id));
                const totalMinutes = (tutorialsData || [])
                    .filter(t => completedTutorialIds.has(t.tutorial_id))
                    .reduce((sum, t) => sum + (t.estimated_duration || 0), 0);
                const hoursSpent = Math.round((totalMinutes / 60) * 10) / 10; // Round to 1 decimal

                // Calculate streak (same logic as dashboard)
                const calculateStreak = () => {
                    if (!progressData || progressData.length === 0) return 0;

                    const completedDates = new Set();
                    completedProgress.forEach(p => {
                        if (p.completed_at) {
                            const date = new Date(p.completed_at);
                            const year = date.getUTCFullYear();
                            const month = String(date.getUTCMonth() + 1).padStart(2, '0');
                            const day = String(date.getUTCDate()).padStart(2, '0');
                            completedDates.add(`${year}-${month}-${day}`);
                        }
                    });

                    if (completedDates.size === 0) return 0;

                    const today = new Date();
                    const todayYear = today.getUTCFullYear();
                    const todayMonth = String(today.getUTCMonth() + 1).padStart(2, '0');
                    const todayDay = String(today.getUTCDate()).padStart(2, '0');
                    const todayStr = `${todayYear}-${todayMonth}-${todayDay}`;

                    const yesterday = new Date(today);
                    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
                    const yesterdayYear = yesterday.getUTCFullYear();
                    const yesterdayMonth = String(yesterday.getUTCMonth() + 1).padStart(2, '0');
                    const yesterdayDay = String(yesterday.getUTCDate()).padStart(2, '0');
                    const yesterdayStr = `${yesterdayYear}-${yesterdayMonth}-${yesterdayDay}`;

                    const allDates = Array.from(completedDates).sort().reverse();
                    const mostRecentDate = allDates[0];

                    if (mostRecentDate < yesterdayStr) return 0;

                    let checkDate = new Date(today);
                    checkDate.setUTCHours(0, 0, 0, 0);

                    if (!completedDates.has(todayStr)) {
                        checkDate.setUTCDate(checkDate.getUTCDate() - 1);
                    }

                    let streak = 0;
                    while (true) {
                        const year = checkDate.getUTCFullYear();
                        const month = String(checkDate.getUTCMonth() + 1).padStart(2, '0');
                        const day = String(checkDate.getUTCDate()).padStart(2, '0');
                        const dateStr = `${year}-${month}-${day}`;

                        if (completedDates.has(dateStr)) {
                            streak++;
                            checkDate.setUTCDate(checkDate.getUTCDate() - 1);
                        } else {
                            break;
                        }
                    }

                    return streak;
                };

                const currentStreak = calculateStreak();

                // Calculate total points (1 point per completed lesson, bonus for streaks)
                const totalPoints = completedProgress.length * 10 + (currentStreak * 5);

                // Determine rank based on points
                const getRank = (points) => {
                    if (points >= 1000) return "Master Learner";
                    if (points >= 500) return "Gold Learner";
                    if (points >= 250) return "Silver Learner";
                    if (points >= 100) return "Bronze Learner";
                    return "Beginner";
                };

                // Get join date from auth user's created_at
                const joinDate = session.user.created_at
                    ? new Date(session.user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                    : "Recently";

                // Calculate active courses (started but not completed)
                const activeProgress = (progressData || []).filter(
                    p => p.started_at !== null && p.completed_at === null
                );

                const activeCourseIds = new Set(activeProgress.map(p => p.tutorial_id));
                const activeCoursesData = (tutorialsData || [])
                    .filter(t => activeCourseIds.has(t.tutorial_id))
                    .map(tutorial => {
                        const progress = activeProgress.find(p => p.tutorial_id === tutorial.tutorial_id);

                        // For individual tutorials, progress is 0% if not completed, 100% if completed
                        // Since these are active (started but not completed), show 0% or calculate based on category
                        // For simplicity, we'll show 0% for individual tutorials
                        const progressPercent = 0;

                        // Calculate last accessed time
                        const lastAccessed = progress?.started_at
                            ? new Date(progress.started_at)
                            : null;
                        const now = new Date();
                        let lastAccessedText = "Recently";
                        if (lastAccessed) {
                            const hoursAgo = Math.floor((now - lastAccessed) / (1000 * 60 * 60));
                            if (hoursAgo < 1) lastAccessedText = "Just now";
                            else if (hoursAgo < 24) lastAccessedText = `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
                            else {
                                const daysAgo = Math.floor(hoursAgo / 24);
                                lastAccessedText = daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`;
                            }
                        }

                        return {
                            id: tutorial.tutorial_id,
                            title: tutorial.title,
                            progress: progressPercent,
                            lessons: 1, // Individual tutorial
                            lastAccessed: lastAccessedText
                        };
                    })
                    .sort((a, b) => {
                        // Sort by last accessed (most recent first)
                        const aProgress = activeProgress.find(p => p.tutorial_id === a.id);
                        const bProgress = activeProgress.find(p => p.tutorial_id === b.id);
                        const aTime = aProgress?.started_at ? new Date(aProgress.started_at).getTime() : 0;
                        const bTime = bProgress?.started_at ? new Date(bProgress.started_at).getTime() : 0;
                        return bTime - aTime;
                    })
                    .slice(0, 5); // Limit to 5 active courses

                // Calculate achievements
                const calculatedAchievements = [
                    {
                        id: 1,
                        title: "First Steps",
                        description: "Completed your first lesson",
                        icon: Star,
                        earned: completedProgress.length >= 1,
                        color: "amber"
                    },
                    {
                        id: 2,
                        title: "Email Master",
                        description: "Completed Email Basics course",
                        icon: Trophy,
                        earned: false, // Would need category check
                        color: "blue"
                    },
                    {
                        id: 3,
                        title: "5-Day Streak",
                        description: "Learn for 5 days in a row",
                        icon: Sparkles,
                        earned: currentStreak >= 5,
                        color: "purple"
                    },
                    {
                        id: 4,
                        title: "Social Butterfly",
                        description: "Complete Social Media course",
                        icon: Award,
                        earned: false, // Would need category check
                        color: "gray"
                    }
                ];

                // Calculate weekly activity
                const weeklyActivityData = [];
                const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                const today = new Date();

                for (let i = 6; i >= 0; i--) {
                    const date = new Date(today);
                    date.setUTCDate(date.getUTCDate() - i);
                    date.setUTCHours(0, 0, 0, 0);

                    const year = date.getUTCFullYear();
                    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
                    const day = String(date.getUTCDate()).padStart(2, '0');
                    const dateStr = `${year}-${month}-${day}`;

                    const dayCompleted = completedProgress.filter(p => {
                        if (!p.completed_at) return false;
                        const pDate = new Date(p.completed_at);
                        const pYear = pDate.getUTCFullYear();
                        const pMonth = String(pDate.getUTCMonth() + 1).padStart(2, '0');
                        const pDay = String(pDate.getUTCDate()).padStart(2, '0');
                        return `${pYear}-${pMonth}-${pDay}` === dateStr;
                    });

                    // Calculate hours for this day
                    const dayTutorialIds = new Set(dayCompleted.map(p => p.tutorial_id));
                    const dayMinutes = (tutorialsData || [])
                        .filter(t => dayTutorialIds.has(t.tutorial_id))
                        .reduce((sum, t) => sum + (t.estimated_duration || 0), 0);
                    const dayHours = dayMinutes / 60;

                    weeklyActivityData.push({
                        day: daysOfWeek[date.getUTCDay()],
                        hours: Math.round(dayHours * 10) / 10,
                        height: Math.min(Math.round((dayHours / 2) * 100), 100), // Max 2 hours = 100%
                        isToday: i === 0
                    });
                }

                // Update state
                setProfileStats({
                    coursesCompleted: completedProgress.length,
                    hoursSpent,
                    currentStreak,
                    totalPoints,
                    joinDate,
                    rank: getRank(totalPoints)
                });

                setAchievements(calculatedAchievements);
                setActiveCourses(activeCoursesData);
                setWeeklyActivity(weeklyActivityData);

                setLearningStats([
                    {
                        label: "Total Lessons",
                        value: String(completedProgress.length),
                        icon: BookOpen,
                        color: "blue"
                    },
                    {
                        label: "Hours Learned",
                        value: String(hoursSpent),
                        icon: Clock,
                        color: "purple"
                    },
                    {
                        label: "Current Streak",
                        value: `${currentStreak} days`,
                        icon: TrendingUp,
                        color: "emerald"
                    },
                    {
                        label: "Total Points",
                        value: String(totalPoints),
                        icon: Target,
                        color: "orange"
                    }
                ]);

            } catch (error) {
                console.error("Error fetching user profile:", error);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchUserProfile();
        }
    }, [session, navigate]);

    // Get badge colors based on rank
    const getBadgeColors = (rank) => {
        switch (rank) {
            case "Beginner":
                return "from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600";
            case "Bronze Learner":
                return "from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600";
            case "Silver Learner":
                return "from-slate-500 to-slate-600 hover:from-slate-400 hover:to-slate-500";
            case "Gold Learner":
                return "from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500";
            case "Master Learner":
                return "from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600";
            default:
                return "from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800";
        }
    };

    // Show loading while checking auth (wait for session to be checked)
    if (!sessionChecked || session === null) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-orange-50 via-orange-50 to-white">
                <Navbar />
                <main className="max-w-6xl mx-auto px-6 lg:px-8 py-12 pb-20">
                    <div className="animate-pulse">
                        <div className="h-32 bg-gray-200 rounded-3xl mb-8"></div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-32 bg-gray-200 rounded-3xl"></div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-orange-50 via-orange-50 to-white">
            <Navbar />

            <main className="max-w-6xl mx-auto px-6 lg:px-8 py-12 pb-20">
                {/* Profile Header */}
                <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 relative overflow-hidden">
                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-linear-to-br from-orange-100 to-purple-100 rounded-full blur-3xl opacity-30 z-0"></div>

                    <div className="relative z-10">
                        <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                            {/* Avatar */}
                            <div className="relative group">
                                <div className="w-32 h-32 bg-linear-to-br from-orange-400 to-purple-500 rounded-full flex items-center justify-center text-white text-5xl font-black shadow-xl">
                                    {userData?.first_name?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <button className="absolute bottom-0 right-0 w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors shadow-lg opacity-0 group-hover:opacity-100">
                                    <Camera className="w-5 h-5" />
                                </button>
                            </div>

                            {/* User Info */}
                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">
                                            {userData?.first_name && userData?.last_name
                                                ? `${userData.first_name} ${userData.last_name}`
                                                : 'User'}
                                        </h1>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Mail className="w-5 h-5 text-gray-600" />
                                            <span className="text-gray-600 font-medium">{userData?.email || 'email@example.com'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-gray-600" />
                                            <span className="text-gray-600 font-medium">Joined {profileStats.joinDate}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => navigate('/settings')}
                                        className="px-6 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
                                    >
                                        <Edit className="w-5 h-5" />
                                        Edit Profile
                                    </button>
                                </div>

                                {/* Rank Badge */}
                                <div className="relative">
                                    <button
                                        ref={rankButtonRef}
                                        onClick={() => {
                                            if (rankButtonRef.current) {
                                                const rect = rankButtonRef.current.getBoundingClientRect();
                                                const popupWidth = 320; // min-w-[320px]
                                                const popupHeight = 400; // estimated height
                                                const viewportWidth = window.innerWidth;
                                                const viewportHeight = window.innerHeight;

                                                // Calculate left position (prevent overflow on right side)
                                                let left = rect.left + window.scrollX;
                                                if (left + popupWidth > viewportWidth) {
                                                    left = viewportWidth - popupWidth - 16; // 16px padding from edge
                                                }

                                                // Calculate top position (prevent overflow on bottom)
                                                let top = rect.bottom + window.scrollY + 8;
                                                if (top + popupHeight > window.scrollY + viewportHeight) {
                                                    // If it would overflow bottom, position above button instead
                                                    top = rect.top + window.scrollY - popupHeight - 8;
                                                }

                                                setPopupPosition({ top, left });
                                            }
                                            setShowRankPopup(!showRankPopup);
                                        }}
                                        className={`inline-flex items-center gap-2 px-5 py-2 bg-linear-to-r ${getBadgeColors(profileStats.rank)} text-white rounded-full font-bold text-sm shadow-lg transition-all cursor-pointer`}
                                    >
                                        <Trophy className="w-5 h-5" />
                                        {profileStats.rank}
                                    </button>

                                    {/* Rank Tier Popup */}
                                    {showRankPopup && (
                                        <>
                                            <div
                                                className="fixed inset-0 z-40"
                                                onClick={() => setShowRankPopup(false)}
                                            ></div>
                                            <div
                                                className="fixed z-50 bg-white rounded-2xl shadow-2xl p-6 min-w-[320px] border border-gray-200"
                                                style={{
                                                    top: `${popupPosition.top}px`,
                                                    left: `${popupPosition.left}px`
                                                }}
                                            >
                                                <div className="flex items-center justify-between mb-4">
                                                    <h3 className="text-lg font-bold text-gray-900">Learning Tiers</h3>
                                                    <button
                                                        onClick={() => setShowRankPopup(false)}
                                                        className="text-gray-400 hover:text-gray-600 transition-colors"
                                                    >
                                                        <span className="text-xl">×</span>
                                                    </button>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-4">
                                                    {profileStats.rank === "Beginner"
                                                        ? "Progress to unlock higher tiers! Complete lessons to earn points."
                                                        : "Earn points by completing lessons to advance through the tiers!"}
                                                </p>
                                                <div className="space-y-3">
                                                    {/* Beginner */}
                                                    <div className={`p-3 rounded-xl border-2 ${profileStats.rank === "Beginner"
                                                        ? "bg-gray-50 border-gray-300"
                                                        : "bg-white border-gray-200"
                                                        }`}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                                                                <span className="font-semibold text-gray-900">Beginner</span>
                                                            </div>
                                                            <span className="text-sm text-gray-600">0-99 points</span>
                                                        </div>
                                                        {profileStats.rank === "Beginner" && (
                                                            <p className="text-xs text-gray-600 mt-1 ml-5">Your current tier</p>
                                                        )}
                                                        {profileStats.rank === "Beginner" && profileStats.totalPoints < 100 && (
                                                            <p className="text-xs text-gray-500 mt-1 ml-5">
                                                                Complete {Math.max(0, Math.ceil((100 - profileStats.totalPoints) / 10))} more lessons to reach Bronze Learner
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Bronze */}
                                                    <div className={`p-3 rounded-xl border-2 ${profileStats.rank === "Bronze Learner"
                                                        ? "bg-orange-50 border-orange-300"
                                                        : "bg-white border-gray-200"
                                                        }`}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                                                                <span className="font-semibold text-gray-900">Bronze Learner</span>
                                                            </div>
                                                            <span className="text-sm text-gray-600">100-249 points</span>
                                                        </div>
                                                        {profileStats.rank === "Bronze Learner" && (
                                                            <p className="text-xs text-orange-600 mt-1 ml-5">Your current tier</p>
                                                        )}
                                                        {profileStats.rank === "Bronze Learner" && profileStats.totalPoints < 250 && (
                                                            <p className="text-xs text-gray-500 mt-1 ml-5">
                                                                Complete {Math.max(0, Math.ceil((250 - profileStats.totalPoints) / 10))} more lessons to reach Silver Learner
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Silver */}
                                                    <div className={`p-3 rounded-xl border-2 ${profileStats.rank === "Silver Learner"
                                                        ? "bg-slate-50 border-slate-300"
                                                        : "bg-white border-gray-200"
                                                        }`}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                                                                <span className="font-semibold text-gray-900">Silver Learner</span>
                                                            </div>
                                                            <span className="text-sm text-gray-600">250-499 points</span>
                                                        </div>
                                                        {profileStats.rank === "Silver Learner" && (
                                                            <p className="text-xs text-slate-600 mt-1 ml-5">Your current tier</p>
                                                        )}
                                                        {profileStats.rank === "Silver Learner" && profileStats.totalPoints < 500 && (
                                                            <p className="text-xs text-gray-500 mt-1 ml-5">
                                                                Complete {Math.max(0, Math.ceil((500 - profileStats.totalPoints) / 10))} more lessons to reach Gold Learner
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Gold */}
                                                    <div className={`p-3 rounded-xl border-2 ${profileStats.rank === "Gold Learner"
                                                        ? "bg-yellow-50 border-yellow-400"
                                                        : "bg-white border-gray-200"
                                                        }`}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                                                <span className="font-semibold text-gray-900">Gold Learner</span>
                                                            </div>
                                                            <span className="text-sm text-gray-600">500-999 points</span>
                                                        </div>
                                                        {profileStats.rank === "Gold Learner" && (
                                                            <p className="text-xs text-yellow-600 mt-1 ml-5">Your current tier</p>
                                                        )}
                                                        {profileStats.rank === "Gold Learner" && profileStats.totalPoints < 1000 && (
                                                            <p className="text-xs text-gray-500 mt-1 ml-5">
                                                                Complete {Math.max(0, Math.ceil((1000 - profileStats.totalPoints) / 10))} more lessons to reach Master Learner
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Master */}
                                                    <div className={`p-3 rounded-xl border-2 ${profileStats.rank === "Master Learner"
                                                        ? "bg-purple-50 border-purple-400"
                                                        : "bg-white border-gray-200"
                                                        }`}>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                                                                <span className="font-semibold text-gray-900">Master Learner</span>
                                                            </div>
                                                            <span className="text-sm text-gray-600">1000+ points</span>
                                                        </div>
                                                        {profileStats.rank === "Master Learner" && (
                                                            <p className="text-xs text-purple-600 mt-1 ml-5">Your current tier</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="mt-4 pt-4 border-t border-gray-200">
                                                    <p className="text-xs text-gray-500 text-center">
                                                        You have {profileStats.totalPoints} points
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Learning Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    {learningStats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="bg-white rounded-3xl shadow-sm p-6 hover:shadow-lg transition-shadow">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${stat.color === 'blue' ? 'bg-blue-100' :
                                    stat.color === 'purple' ? 'bg-purple-100' :
                                        stat.color === 'emerald' ? 'bg-emerald-100' :
                                            'bg-orange-100'
                                    }`}>
                                    <Icon className={`w-6 h-6 ${stat.color === 'blue' ? 'text-blue-600' :
                                        stat.color === 'purple' ? 'text-purple-600' :
                                            stat.color === 'emerald' ? 'text-emerald-600' :
                                                'text-orange-600'
                                        }`} />
                                </div>
                                <div className="text-3xl font-black text-gray-900 mb-1">{stat.value}</div>
                                <div className="text-sm font-semibold text-gray-600">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Active Courses */}
                        <div className="bg-white rounded-3xl shadow-sm p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center">
                                    <BookOpen className="w-6 h-6 text-blue-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Active Courses</h2>
                            </div>

                            <div className="space-y-4">
                                {activeCourses.length > 0 ? activeCourses.map((course) => (
                                    <div key={course.id} className="p-5 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                                        <div className="flex justify-between items-start mb-3">
                                            <h3 className="text-lg font-bold text-gray-900">{course.title}</h3>
                                            <span className="text-sm font-semibold text-gray-600">{course.lastAccessed}</span>
                                        </div>

                                        <div className="mb-3">
                                            <div className="flex justify-between text-xs font-semibold mb-2">
                                                <span className="text-gray-600">{course.lessons} lessons</span>
                                                <span className="text-gray-900">{course.progress}% Complete</span>
                                            </div>
                                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-blue-500"
                                                    style={{ width: `${course.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => navigate(`/tutorials/${course.id}`)}
                                            className="px-4 py-2 bg-gray-900 text-white rounded-full font-semibold text-sm hover:bg-gray-800 transition-colors"
                                        >
                                            Continue Learning
                                        </button>
                                    </div>
                                )) : (
                                    <p className="text-gray-500 text-center py-8">No active courses. Start learning to see your progress here!</p>
                                )}
                            </div>
                        </div>

                        {/* Learning Progress Chart */}
                        <div className="bg-white rounded-3xl shadow-sm p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center">
                                    <BarChart3 className="w-6 h-6 text-purple-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Learning Activity</h2>
                            </div>

                            <div className="space-y-4">
                                {/* Weekly Activity Bars */}
                                {weeklyActivity.length > 0 ? weeklyActivity.map((activity, index) => (
                                    <div key={index} className="flex items-center gap-4">
                                        <span className={`text-sm font-semibold w-12 ${activity.isToday ? 'text-purple-600' : 'text-gray-600'}`}>
                                            {activity.day}
                                        </span>
                                        <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${activity.isToday ? 'bg-purple-500' : 'bg-gray-300'}`}
                                                style={{ width: `${activity.height}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                                            {activity.hours} hr
                                        </span>
                                    </div>
                                )) : (
                                    <p className="text-gray-500 text-center py-8">No activity data available</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        {/* Achievements */}
                        <div className="bg-white rounded-3xl shadow-sm p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                                    <Award className="w-6 h-6 text-amber-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
                            </div>

                            <div className="space-y-3">
                                {achievements.map((achievement) => {
                                    const Icon = achievement.icon;
                                    return (
                                        <div
                                            key={achievement.id}
                                            className={`p-4 rounded-2xl border-2 transition-all ${achievement.earned
                                                ? 'bg-linear-to-br from-amber-50 to-orange-50 border-amber-200'
                                                : 'bg-gray-50 border-gray-200 opacity-50'
                                                }`}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${achievement.earned
                                                    ? `${achievement.color === 'amber' ? 'bg-amber-200' :
                                                        achievement.color === 'blue' ? 'bg-blue-200' :
                                                            achievement.color === 'purple' ? 'bg-purple-200' :
                                                                'bg-gray-200'}`
                                                    : 'bg-gray-200'
                                                    }`}>
                                                    <Icon className={`w-6 h-6 ${achievement.earned
                                                        ? `${achievement.color === 'amber' ? 'text-amber-600' :
                                                            achievement.color === 'blue' ? 'text-blue-600' :
                                                                achievement.color === 'purple' ? 'text-purple-600' :
                                                                    'text-gray-600'}`
                                                        : 'text-gray-400'
                                                        }`} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-900 mb-1">{achievement.title}</h3>
                                                    <p className="text-xs text-gray-600">{achievement.description}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Learning Goal */}
                        <div className="bg-linear-to-br from-emerald-500 to-teal-500 rounded-3xl shadow-lg p-8 text-white">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                                <Target className="w-7 h-7 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Daily Goal</h3>
                            <p className="text-emerald-100 mb-4">
                                {profileStats.currentStreak > 0
                                    ? `Keep up your ${profileStats.currentStreak}-day streak! 🔥`
                                    : "Start your learning streak today!"}
                            </p>
                            <div className="bg-white/20 rounded-full h-3 overflow-hidden mb-2">
                                <div
                                    className="bg-white h-full rounded-full transition-all"
                                    style={{ width: `${Math.min((profileStats.currentStreak / 7) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-sm font-semibold text-emerald-50">
                                {profileStats.currentStreak > 0
                                    ? `${profileStats.currentStreak} day${profileStats.currentStreak > 1 ? 's' : ''} streak`
                                    : "Complete a lesson to start"}
                            </p>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-3xl shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <button
                                    onClick={() => navigate('/allcourses')}
                                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <span className="font-semibold text-gray-900">Browse Courses</span>
                                    <BookOpen className="w-5 h-5 text-gray-400" />
                                </button>
                                <button
                                    onClick={() => navigate('/settings')}
                                    className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                                >
                                    <span className="font-semibold text-gray-900">Settings</span>
                                    <User className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

