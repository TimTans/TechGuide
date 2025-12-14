import {
    Monitor, LogOut, Mail, Video, MessageCircle, ShoppingCart, Phone, AlertTriangle, CheckCircle,
    Clock, ArrowRight, Bell, Users, Lock, Sparkles, BookOpen, UserCheck, TrendingUp, FileText, User
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase, UserAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getCategoryMetadata } from "../components/AllCourses/utils";
import CreateCourseModal from "../components/CreateCourseModal";

export default function InstructorDashboard({ user: userProp }) {
    const navigate = useNavigate();
    const { session } = UserAuth();
    const user = userProp || session?.user;
    const [instructorStats, setInstructorStats] = useState({
        totalStudents: 0,
        activeCourses: 0,
        completedSessions: 0,
        averageRating: null,
    });
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    // Format time ago
    const formatTimeAgo = (dateString) => {
        if (!dateString) return "Recently";
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;

        // Format as date if older
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    };

    // Redirect to signin if not authenticated
    useEffect(() => {
        if (session === null) {
            navigate("/signin");
        }
    }, [session, navigate]);

    useEffect(() => {
        const fetchInstructorData = async () => {
            if (!session?.user) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);

                // Fetch all users
                const { data: allUsersData, error: allUsersError } = await supabase
                    .from("users")
                    .select("user_id, first_name, last_name, email, user_role");

                if (allUsersError) {
                    console.error("Error fetching users:", allUsersError);
                }

                // Debug: Log all user roles to see actual values
                console.log("All users and their roles:", allUsersData?.map(u => ({ email: u.email, role: u.user_role })));

                // Filter students - check for any student-like role (case-insensitive)
                // This handles "Student", "student", or any enum value containing "student"
                const studentsData = (allUsersData || []).filter(user => {
                    const role = user.user_role?.toLowerCase() || "";
                    // Count as student if role includes "student" OR if role is NOT instructor/admin
                    return role.includes("student") ||
                        (role !== "instructor" && role !== "admin" && role !== "");
                });

                const totalStudents = studentsData?.length || 0;
                console.log("Total students found:", totalStudents);

                // Fetch all categories
                const { data: categoriesData, error: categoriesError } = await supabase
                    .from("categories")
                    .select("category_id, category_name, description")
                    .order("display_order", { ascending: true });

                if (categoriesError) {
                    console.error("Error fetching categories:", categoriesError);
                    setCategories([]);
                } else {
                    setCategories(categoriesData || []);
                }

                // Fetch all tutorials
                const { data: tutorialsData, error: tutorialsError } = await supabase
                    .from("tutorials")
                    .select("tutorial_id, category_id, title");

                if (tutorialsError) {
                    console.error("Error fetching tutorials:", tutorialsError);
                }

                // Fetch all user progress
                const { data: progressData, error: progressError } = await supabase
                    .from("user_progress")
                    .select("user_id, tutorial_id, status, completed_at, started_at");

                if (progressError) {
                    console.error("Error fetching progress:", progressError);
                }

                // Calculate completed sessions
                const completedSessions = (progressData || []).filter(
                    p => p.completed_at !== null
                ).length;

                // Get unique categories that have tutorials
                const activeCategories = new Set(
                    (tutorialsData || []).map(t => t.category_id)
                );
                const activeCourses = activeCategories.size;

                // Calculate stats per category
                const coursesWithStats = (categoriesData || []).map(category => {
                    const categoryTutorials = (tutorialsData || []).filter(
                        t => t.category_id === category.category_id
                    );
                    const categoryTutorialIds = new Set(categoryTutorials.map(t => t.tutorial_id));

                    // Get students who have started any tutorial in this category
                    const studentsInCategory = new Set(
                        (progressData || [])
                            .filter(p => categoryTutorialIds.has(p.tutorial_id))
                            .map(p => p.user_id)
                    );

                    // Calculate average progress for this category
                    let totalProgress = 0;
                    let studentCount = 0;

                    studentsInCategory.forEach(studentId => {
                        const studentTutorials = categoryTutorials.length;
                        const studentCompleted = (progressData || []).filter(
                            p => p.user_id === studentId &&
                                categoryTutorialIds.has(p.tutorial_id) &&
                                p.completed_at !== null
                        ).length;
                        const progress = studentTutorials > 0
                            ? Math.round((studentCompleted / studentTutorials) * 100)
                            : 0;
                        totalProgress += progress;
                        studentCount++;
                    });

                    const avgProgress = studentCount > 0
                        ? Math.round(totalProgress / studentCount)
                        : 0;

                    const metadata = getCategoryMetadata(category.category_id);
                    return {
                        id: category.category_id,
                        title: category.category_name,
                        icon: metadata.icon,
                        description: category.description || `Learn about ${category.category_name}`,
                        students: studentsInCategory.size,
                        progress: avgProgress,
                        color: metadata.color
                    };
                }); // Show all categories

                setCourses(coursesWithStats);

                // Get recent students with their progress
                const studentProgressMap = {};
                (progressData || []).forEach(progress => {
                    if (!studentProgressMap[progress.user_id]) {
                        studentProgressMap[progress.user_id] = {
                            tutorials: new Set(),
                            completed: 0,
                            lastActivity: null
                        };
                    }
                    studentProgressMap[progress.user_id].tutorials.add(progress.tutorial_id);
                    if (progress.completed_at) {
                        studentProgressMap[progress.user_id].completed++;
                    }

                    // Track most recent activity (completed_at or started_at)
                    const activityDate = progress.completed_at || progress.started_at;
                    if (activityDate) {
                        const currentLastActivity = studentProgressMap[progress.user_id].lastActivity;
                        if (!currentLastActivity || new Date(activityDate) > new Date(currentLastActivity)) {
                            studentProgressMap[progress.user_id].lastActivity = activityDate;
                        }
                    }
                });

                const studentsWithProgress = (studentsData || [])
                    .map(student => {
                        const progress = studentProgressMap[student.user_id];
                        if (!progress) return null;

                        const totalTutorials = (tutorialsData || []).length;
                        const studentProgress = totalTutorials > 0
                            ? Math.round((progress.completed / totalTutorials) * 100)
                            : 0;

                        // Get most recent category they worked on
                        const studentTutorials = Array.from(progress.tutorials);
                        const mostRecentTutorial = studentTutorials.length > 0
                            ? (tutorialsData || []).find(t => t.tutorial_id === studentTutorials[0])
                            : null;
                        const mostRecentCategory = mostRecentTutorial
                            ? (categoriesData || []).find(c => c.category_id === mostRecentTutorial.category_id)
                            : null;

                        return {
                            id: student.user_id,
                            name: `${student.first_name} ${student.last_name}`,
                            course: mostRecentCategory?.category_name || "Getting Started",
                            progress: studentProgress,
                            status: progress.completed > 0 ? "active" : "new",
                            lastActivity: progress.lastActivity
                        };
                    })
                    .filter(s => s !== null)
                    .sort((a, b) => {
                        const dateA = new Date(a.lastActivity || 0);
                        const dateB = new Date(b.lastActivity || 0);
                        return dateB - dateA;
                    })
                    .slice(0, 10); // Get top 10 most recent

                setStudents(studentsWithProgress);

                // Get recent activities
                const activities = (progressData || [])
                    .filter(p => p.completed_at !== null)
                    .map(progress => {
                        const tutorial = (tutorialsData || []).find(t => t.tutorial_id === progress.tutorial_id);
                        const student = (studentsData || []).find(s => s.user_id === progress.user_id);
                        const category = tutorial
                            ? (categoriesData || []).find(c => c.category_id === tutorial.category_id)
                            : null;

                        return {
                            id: `${progress.user_id}-${progress.tutorial_id}-${progress.completed_at}`,
                            title: student && tutorial
                                ? `Completed: ${tutorial.title}`
                                : "Lesson completed",
                            time: formatTimeAgo(progress.completed_at),
                            icon: CheckCircle,
                            color: "text-emerald-600 bg-emerald-50",
                            timestamp: progress.completed_at
                        };
                    })
                    .sort((a, b) => {
                        const dateA = new Date(a.timestamp || 0);
                        const dateB = new Date(b.timestamp || 0);
                        return dateB - dateA;
                    })
                    .slice(0, 5); // Get 5 most recent

                setRecentActivities(activities);

                // Update stats
                setInstructorStats({
                    totalStudents,
                    activeCourses,
                    completedSessions,
                    averageRating: null, // Rating system not implemented yet
                });

            } catch (error) {
                console.error("Error fetching instructor data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructorData();
    }, [session]);

    const handleCreateCourse = async (courseData) => {
        try {
            const { error } = await supabase
                .from('tutorials')
                .insert([courseData]);

            if (error) {
                console.error('Error creating course:', error);
                alert('Failed to create course. Please try again.');
            } else {
                setIsCreateModalOpen(false);
                // Refresh the data
                window.location.reload();
            }
        } catch (error) {
            console.error('Error creating course:', error);
            alert('Failed to create course. Please try again.');
        }
    };

    // Show loading or nothing while checking auth
    if (session === null) {
        return null;
    }

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
                                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">3</span>
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
                                Instructor Dashboard
                            </h1>
                            {user?.email && (
                                <p className="text-xl text-gray-600">
                                    {user.email.split('@')[0]}
                                </p>
                            )}
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => navigate("/dashboard?view=student")}
                                className="bg-blue-500 hover:bg-blue-600 text-white rounded-3xl shadow-md px-6 py-3 font-semibold transition-colors flex items-center gap-2"
                            >
                                <User className="w-5 h-5" />
                                View as Student
                            </button>
                            <div className="bg-white rounded-3xl shadow-md p-6 min-w-[140px] text-center hover:shadow-xl transition-shadow">
                                <div className="text-4xl font-black text-gray-900 mb-1">{instructorStats.totalStudents}</div>
                                <div className="text-sm font-semibold text-gray-600">Total Students</div>
                            </div>
                            <div className="bg-white rounded-3xl shadow-md p-6 min-w-[140px] text-center hover:shadow-xl transition-shadow">
                                <div className="text-4xl font-black text-gray-900 mb-1">{instructorStats.activeCourses}</div>
                                <div className="text-sm font-semibold text-gray-600">Active Courses</div>
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
                                <button
                                    onClick={() => navigate("/allcourses")}
                                    className="text-gray-600 hover:text-gray-900 font-semibold text-sm flex items-center gap-1"
                                >
                                    Manage All
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                            {loading ? (
                                <div className="text-center py-12 text-gray-600">Loading courses...</div>
                            ) : courses.length === 0 ? (
                                <div className="text-center py-12 text-gray-600">No courses available yet.</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {courses.map((course) => {
                                        const Icon = course.icon;
                                        const colorClasses = {
                                            blue: { bg: 'bg-blue-100', text: 'text-blue-600', progress: 'bg-blue-500' },
                                            purple: { bg: 'bg-purple-100', text: 'text-purple-600', progress: 'bg-purple-500' },
                                            pink: { bg: 'bg-pink-100', text: 'text-pink-600', progress: 'bg-pink-500' },
                                            emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', progress: 'bg-emerald-500' },
                                            orange: { bg: 'bg-orange-100', text: 'text-orange-600', progress: 'bg-orange-500' },
                                            indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', progress: 'bg-indigo-500' },
                                            red: { bg: 'bg-red-100', text: 'text-red-600', progress: 'bg-red-500' },
                                            violet: { bg: 'bg-violet-100', text: 'text-violet-600', progress: 'bg-violet-500' },
                                            rose: { bg: 'bg-rose-100', text: 'text-rose-600', progress: 'bg-rose-500' },
                                            sky: { bg: 'bg-sky-100', text: 'text-sky-600', progress: 'bg-sky-500' },
                                            teal: { bg: 'bg-teal-100', text: 'text-teal-600', progress: 'bg-teal-500' },
                                            cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', progress: 'bg-cyan-500' }
                                        };
                                        const colors = colorClasses[course.color] || colorClasses.blue;
                                        return (
                                            <div
                                                key={course.id}
                                                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colors.bg}`}>
                                                        <Icon className={`w-7 h-7 ${colors.text}`} />
                                                    </div>
                                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                                                        {course.students} Students
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{course.description}</p>

                                                <div className="mb-4">
                                                    <div className="flex justify-between text-xs font-semibold mb-2">
                                                        <span className="text-gray-600">Average Progress</span>
                                                        <span className="text-gray-900">{course.progress}%</span>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full ${colors.progress}`}
                                                            style={{ width: `${course.progress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate("/allcourses", { state: { selectedCategoryId: course.id } });
                                                    }}
                                                    className="w-full py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group-hover:gap-3"
                                                >
                                                    Manage Course
                                                    <ArrowRight className="w-5 h-5" />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Students List */}
                        <div className="bg-white rounded-3xl shadow-sm p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Recent Students</h2>
                                <button className="text-gray-600 hover:text-gray-900 font-semibold text-sm flex items-center gap-1">
                                    View All
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                            {loading ? (
                                <div className="text-center py-12 text-gray-600">Loading students...</div>
                            ) : students.length === 0 ? (
                                <div className="text-center py-12 text-gray-600">No students with activity yet.</div>
                            ) : (
                                <div className="space-y-4">
                                    {students.map((student) => (
                                        <div key={student.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-linear-to-br from-orange-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold">
                                                    {student.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                                                    <p className="text-sm text-gray-600">{student.course}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right">
                                                    <div className="text-sm font-semibold text-gray-900">{student.progress}%</div>
                                                    <div className="text-xs text-gray-600">Progress</div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${student.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {student.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-3xl shadow-sm p-8">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                            {loading ? (
                                <div className="text-center py-12 text-gray-600">Loading activities...</div>
                            ) : recentActivities.length === 0 ? (
                                <div className="text-center py-12 text-gray-600">No recent activity.</div>
                            ) : (
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
                            )}
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Quick Stats */}
                        <div className="bg-white rounded-3xl shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                                        <span className="text-sm font-semibold text-gray-700">Avg. Rating</span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">
                                        {instructorStats.averageRating !== null ? instructorStats.averageRating.toFixed(1) : 'N/A'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-blue-600" />
                                        <span className="text-sm font-semibold text-gray-700">Sessions</span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">{instructorStats.completedSessions}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white rounded-3xl shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <button
                                    onClick={() => setIsCreateModalOpen(true)}
                                    className="w-full py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    <BookOpen className="w-5 h-5" />
                                    Create New Course
                                </button>
                                <button className="w-full py-3 bg-emerald-500 text-white rounded-full font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Add Lesson Content
                                </button>
                            </div>
                        </div>

                        {/* Help & Support */}
                        <div className="bg-emerald-500 rounded-3xl shadow-lg p-8 text-white text-center">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Phone className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Need Support?</h3>
                            <p className="text-emerald-100 mb-6 text-sm">
                                Contact our admin team for assistance
                            </p>
                            <button className="w-full py-3 bg-white text-emerald-600 rounded-full font-bold hover:bg-emerald-50 transition-colors mb-3">
                                Contact Admin
                            </button>
                            <p className="text-xl font-bold text-white/90">(123) 456-7890</p>
                        </div>

                        {/* Daily Tip */}
                        <div className="bg-blue-50 rounded-3xl shadow-sm p-6 border-2 border-blue-100">
                            <div className="flex items-start gap-3">
                                <Lock className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-bold text-gray-900 mb-1">💡 Teaching Tip</h4>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        Break complex topics into smaller, digestible steps for better student comprehension.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <CreateCourseModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                categories={categories}
                onSubmit={handleCreateCourse}
            />
        </div>
    );
};

