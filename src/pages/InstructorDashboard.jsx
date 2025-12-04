import {
    Monitor, LogOut, Mail, Video, MessageCircle, ShoppingCart, Phone, AlertTriangle, CheckCircle,
    Clock, ArrowRight, Bell, Users, Lock, Sparkles, BookOpen, UserCheck, TrendingUp, FileText, X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function InstructorDashboard({ user }) {
    const navigate = useNavigate();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        category_id: "",
        title: "",
        description: "",
        difficulty_level: "",
        estimated_duration: "",
        video_url: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    // Fetch categories from database
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data, error } = await supabase
                    .from("categories")
                    .select("category_id, category_name")
                    .order("display_order", { ascending: true });

                if (error) {
                    console.error("Error fetching categories:", error);
                } else {
                    setCategories(data || []);
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };

        if (showCreateModal) {
            fetchCategories();
        }
    }, [showCreateModal]);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError("");
        setSuccess("");
    };

    // Handle form submission
    const handleCreateCourse = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        // Validation
        if (!formData.category_id || !formData.title || !formData.description ||
            !formData.difficulty_level || !formData.estimated_duration) {
            setError("Please fill in all required fields");
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from("tutorials")
                .insert([
                    {
                        category_id: parseInt(formData.category_id),
                        title: formData.title,
                        description: formData.description,
                        difficulty_level: formData.difficulty_level,
                        estimated_duration: parseInt(formData.estimated_duration),
                        video_url: formData.video_url || null
                    }
                ])
                .select();

            if (error) {
                console.error("Error creating course:", error);
                setError(error.message || "Failed to create course. Please try again.");
            } else {
                setSuccess("Course created successfully!");
                // Reset form
                setFormData({
                    category_id: "",
                    title: "",
                    description: "",
                    difficulty_level: "",
                    estimated_duration: "",
                    video_url: ""
                });
                // Close modal after 1.5 seconds
                setTimeout(() => {
                    setShowCreateModal(false);
                    setSuccess("");
                    window.location.reload();
                }, 1500);
            }
        } catch (err) {
            console.error("Error creating course:", err);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Mock data for instructor stats
    const instructorStats = {
        totalStudents: 42,
        activeCourses: 6,
        completedSessions: 128,
        averageRating: 4.8,
    };

    const courses = [
        {
            id: 1,
            title: "Email Basics",
            icon: Mail,
            description: "Teaching email fundamentals to seniors",
            students: 15,
            progress: 75,
            color: "blue"
        },
        {
            id: 2,
            title: "Video Calls",
            icon: Video,
            description: "Master Zoom, Skype, and FaceTime",
            students: 12,
            progress: 60,
            color: "purple"
        },
        {
            id: 3,
            title: "Social Media",
            icon: MessageCircle,
            description: "Connect with family on Facebook & Instagram",
            students: 10,
            progress: 45,
            color: "pink"
        },
        {
            id: 4,
            title: "Online Shopping",
            icon: ShoppingCart,
            description: "Shop safely on Amazon, eBay, and more",
            students: 5,
            progress: 30,
            color: "emerald"
        }
    ];

    const recentActivities = [
        {
            id: 1,
            title: "New student enrolled: Email Basics",
            time: "Today at 2:30 PM",
            icon: UserCheck,
            color: "text-blue-600 bg-blue-50"
        },
        {
            id: 2,
            title: "Session completed: Video Calls - Lesson 3",
            time: "Today at 1:15 PM",
            icon: CheckCircle,
            color: "text-emerald-600 bg-emerald-50"
        },
        {
            id: 3,
            title: "Student achievement: First Week Complete!",
            time: "Yesterday",
            icon: Sparkles,
            color: "text-amber-600 bg-amber-50"
        }
    ];

    const students = [
        { id: 1, name: "Mary Johnson", course: "Email Basics", progress: 80, status: "active" },
        { id: 2, name: "Robert Smith", course: "Video Calls", progress: 60, status: "active" },
        { id: 3, name: "Patricia Williams", course: "Social Media", progress: 45, status: "active" },
        { id: 4, name: "James Brown", course: "Online Shopping", progress: 30, status: "active" },
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
                                <button className="text-gray-600 hover:text-gray-900 font-semibold text-sm flex items-center gap-1">
                                    Manage All
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {courses.map((course) => {
                                    const Icon = course.icon;
                                    return (
                                        <div
                                            key={course.id}
                                            className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${course.color === 'blue' ? 'bg-blue-100' :
                                                    course.color === 'purple' ? 'bg-purple-100' :
                                                        course.color === 'pink' ? 'bg-pink-100' :
                                                            'bg-emerald-100'
                                                    }`}>
                                                    <Icon className={`w-7 h-7 ${course.color === 'blue' ? 'text-blue-600' :
                                                        course.color === 'purple' ? 'text-purple-600' :
                                                            course.color === 'pink' ? 'text-pink-600' :
                                                                'text-emerald-600'
                                                        }`} />
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
                                                        className={`h-full ${course.color === 'blue' ? 'bg-blue-500' :
                                                            course.color === 'purple' ? 'bg-purple-500' :
                                                                course.color === 'pink' ? 'bg-pink-500' :
                                                                    'bg-emerald-500'
                                                            }`}
                                                        style={{ width: `${course.progress}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <button className="w-full py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group-hover:gap-3">
                                                Manage Course
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
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
                        {/* Quick Stats */}
                        <div className="bg-white rounded-3xl shadow-sm p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <TrendingUp className="w-5 h-5 text-emerald-600" />
                                        <span className="text-sm font-semibold text-gray-700">Avg. Rating</span>
                                    </div>
                                    <span className="text-lg font-bold text-gray-900">{instructorStats.averageRating}</span>
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
                                    onClick={() => setShowCreateModal(true)}
                                    className="w-full py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    <BookOpen className="w-5 h-5" />
                                    Create New Course
                                </button>
                                <button className="w-full py-3 bg-emerald-500 text-white rounded-full font-semibold hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Add Lesson Content
                                </button>
                                <button className="w-full py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2">
                                    <Users className="w-5 h-5" />
                                    Manage Students
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

            {/* Create Course Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                    {/* Blur backdrop - clickable to close */}
                    <div
                        className="fixed inset-0 backdrop-blur-md -z-10"
                        onClick={() => {
                            setShowCreateModal(false);
                            setFormData({
                                category_id: "",
                                title: "",
                                description: "",
                                difficulty_level: "",
                                estimated_duration: "",
                                video_url: ""
                            });
                            setError("");
                            setSuccess("");
                        }}
                    ></div>
                    {/* Modal content */}
                    <div
                        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-3xl">
                            <h2 className="text-3xl font-black text-gray-900">Create New Course</h2>
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setFormData({
                                        category_id: "",
                                        title: "",
                                        description: "",
                                        difficulty_level: "",
                                        estimated_duration: "",
                                        video_url: ""
                                    });
                                    setError("");
                                    setSuccess("");
                                }}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6 text-gray-700" />
                            </button>
                        </div>

                        <form onSubmit={handleCreateCourse} className="p-8 space-y-6">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5" />
                                    <span className="text-sm font-semibold">{error}</span>
                                </div>
                            )}

                            {success && (
                                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    <span className="text-sm font-semibold">{success}</span>
                                </div>
                            )}

                            {/* Category Dropdown */}
                            <div>
                                <label htmlFor="category_id" className="block text-sm font-bold text-gray-900 mb-2">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="category_id"
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 bg-white"
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category.category_id} value={category.category_id}>
                                            {category.category_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Title */}
                            <div>
                                <label htmlFor="title" className="block text-sm font-bold text-gray-900 mb-2">
                                    Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter course title"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-bold text-gray-900 mb-2">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required
                                    rows="4"
                                    placeholder="Enter course description"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 resize-none"
                                />
                            </div>

                            {/* Difficulty Level */}
                            <div>
                                <label htmlFor="difficulty_level" className="block text-sm font-bold text-gray-900 mb-2">
                                    Difficulty Level <span className="text-red-500">*</span>
                                </label>
                                <select
                                    id="difficulty_level"
                                    name="difficulty_level"
                                    value={formData.difficulty_level}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 bg-white"
                                >
                                    <option value="">Select difficulty level</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                </select>
                            </div>

                            {/* Estimated Duration */}
                            <div>
                                <label htmlFor="estimated_duration" className="block text-sm font-bold text-gray-900 mb-2">
                                    Estimated Duration (minutes) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="estimated_duration"
                                    name="estimated_duration"
                                    value={formData.estimated_duration}
                                    onChange={handleInputChange}
                                    required
                                    min="1"
                                    placeholder="e.g., 60"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                                />
                            </div>

                            {/* Video URL */}
                            <div>
                                <label htmlFor="video_url" className="block text-sm font-bold text-gray-900 mb-2">
                                    Video URL (Optional)
                                </label>
                                <input
                                    type="url"
                                    id="video_url"
                                    name="video_url"
                                    value={formData.video_url}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/video"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900"
                                />
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowCreateModal(false);
                                        setFormData({
                                            category_id: "",
                                            title: "",
                                            description: "",
                                            difficulty_level: "",
                                            estimated_duration: "",
                                            video_url: ""
                                        });
                                        setError("");
                                        setSuccess("");
                                    }}
                                    className="flex-1 py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-full font-semibold hover:bg-gray-50 transition-colors"
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 px-6 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Clock className="w-5 h-5 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            Create Course
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

