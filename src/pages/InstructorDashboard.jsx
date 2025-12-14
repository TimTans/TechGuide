import {
    Monitor, LogOut, Bell, BookOpen, FileText, Phone, Lock,
    Clock, ArrowRight, User, CheckCircle, ChevronDown, Settings
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase, UserAuth } from "../context/AuthContext";
import { useEffect, useState, useRef } from "react";
import CreateCourseModal from "../components/CreateCourseModal";
import CourseCard from "../components/InstructorDashboard/CourseCard";
import StudentCard from "../components/InstructorDashboard/StudentCard";
import ActivityCard from "../components/InstructorDashboard/ActivityCard";
import {
    filterStudents,
    calculateCourseStats,
    buildStudentProgressMap,
    formatStudentsWithProgress,
    formatRecentActivities
} from "../utils/instructorDataHelpers";

export default function InstructorDashboard({ user: userProp }) {
    const navigate = useNavigate();
    const { session } = UserAuth();
    const user = userProp || session?.user;

    const [instructorStats, setInstructorStats] = useState({
        totalStudents: 0,
        activeCourses: 0,
        completedSessions: 0,
    });
    const [courses, setCourses] = useState([]);
    const [students, setStudents] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate("/");
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

                // Fetch all data in parallel
                const [
                    { data: allUsersData, error: allUsersError },
                    { data: categoriesData, error: categoriesError },
                    { data: tutorialsData, error: tutorialsError },
                    { data: progressData, error: progressError }
                ] = await Promise.all([
                    supabase.from("users").select("user_id, first_name, last_name, email, user_role"),
                    supabase.from("categories").select("category_id, category_name, description").order("display_order", { ascending: true }),
                    supabase.from("tutorials").select("tutorial_id, category_id, title"),
                    supabase.from("user_progress").select("user_id, tutorial_id, status, completed_at, started_at")
                ]);

                // Handle errors - check for RLS issues
                if (allUsersError) {
                    console.error("Error fetching users:", allUsersError);
                    console.error("RLS Policy Issue? Error code:", allUsersError.code, "Message:", allUsersError.message);
                    // Common RLS error codes: PGRST116 (permission denied), 42501 (insufficient privilege)
                    if (allUsersError.code === 'PGRST116' || allUsersError.message?.includes('permission') || allUsersError.message?.includes('policy')) {
                        console.warn("⚠️ This looks like an RLS policy issue. Instructors need a policy to view all users.");
                    }
                }
                if (categoriesError) {
                    console.error("Error fetching categories:", categoriesError);
                }
                if (tutorialsError) {
                    console.error("Error fetching tutorials:", tutorialsError);
                }
                if (progressError) {
                    console.error("Error fetching progress:", progressError);
                }

                // Process data
                const studentsData = filterStudents(allUsersData);
                const totalStudents = studentsData?.length || 0;

                // Debug logging to help diagnose RLS issues
                if (!allUsersError) {
                    console.log("✅ Users query successful. Total users fetched:", allUsersData?.length || 0);
                    console.log("✅ Students filtered:", totalStudents);
                    if (allUsersData && allUsersData.length > 0) {
                        const roleCounts = {};
                        allUsersData.forEach(u => {
                            const role = u.user_role || 'null';
                            roleCounts[role] = (roleCounts[role] || 0) + 1;
                        });
                        console.log("User roles breakdown:", roleCounts);
                    }
                } else {
                    console.warn("❌ Users query failed - may be RLS policy issue");
                }

                setCategories(categoriesData || []);

                // Calculate completed sessions
                const completedSessions = (progressData || []).filter(
                    p => p.completed_at !== null
                ).length;

                // Calculate course stats
                const coursesWithStats = calculateCourseStats(
                    categoriesData,
                    tutorialsData,
                    progressData
                );
                setCourses(coursesWithStats);

                // Count total number of lessons (tutorials)
                const activeCourses = (tutorialsData || []).length;

                // Process student data
                const studentProgressMap = buildStudentProgressMap(progressData);
                const studentsWithProgress = formatStudentsWithProgress(
                    studentsData,
                    studentProgressMap,
                    tutorialsData,
                    categoriesData
                );
                setStudents(studentsWithProgress);

                // Process recent activities
                const activities = formatRecentActivities(
                    progressData,
                    tutorialsData,
                    studentsData,
                    categoriesData
                );
                setRecentActivities(activities);

                // Update stats
                setInstructorStats({
                    totalStudents,
                    activeCourses,
                    completedSessions,
                });

            } catch (error) {
                console.error("Error fetching instructor data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInstructorData();
    }, [session, refreshTrigger]);

    // Handle clicking outside dropdown to close it
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

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
                // Trigger data refresh
                setRefreshTrigger(prev => prev + 1);
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
                            {/* User Profile Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-sm font-semibold"
                                >
                                    <User className="w-5 h-5 text-gray-700" />
                                    <ChevronDown className={`w-4 h-4 text-gray-700 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                        <button
                                            onClick={() => {
                                                navigate("/userprofile");
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                                        >
                                            <User className="w-5 h-5 text-gray-700" />
                                            <span className="text-sm font-medium text-gray-700">User Profile</span>
                                        </button>

                                        <button
                                            onClick={() => {
                                                navigate("/settings");
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                                        >
                                            <Settings className="w-5 h-5 text-gray-700" />
                                            <span className="text-sm font-medium text-gray-700">Settings</span>
                                        </button>

                                        <div className="border-t border-gray-200 my-2"></div>

                                        <button
                                            onClick={() => {
                                                handleSignOut();
                                                setIsDropdownOpen(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
                                        >
                                            <LogOut className="w-5 h-5 text-red-600" />
                                            <span className="text-sm font-medium text-red-600">Sign Out</span>
                                        </button>
                                    </div>
                                )}
                            </div>
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
                                    {courses.map((course) => (
                                        <CourseCard key={course.id} course={course} />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Students List */}
                        <div className="bg-white rounded-3xl shadow-sm p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Recent Students</h2>
                                <button
                                    onClick={() => navigate("/allstudents")}
                                    className="text-gray-600 hover:text-gray-900 font-semibold text-sm flex items-center gap-1"
                                >
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
                                        <StudentCard key={student.id} student={student} />
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
                                    {recentActivities.map((activity) => (
                                        <ActivityCard key={activity.id} activity={activity} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
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
}
