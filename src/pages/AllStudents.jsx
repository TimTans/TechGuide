import { useNavigate, Link } from "react-router-dom";
import { supabase, UserAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import {
    Monitor, ArrowLeft, Search, User, CheckCircle, Clock,
    TrendingUp, Filter, X
} from "lucide-react";
import {
    filterStudents,
    buildStudentProgressMap,
    formatStudentsWithProgress
} from "../utils/instructorDataHelpers";

export default function AllStudents() {
    const navigate = useNavigate();
    const { session } = UserAuth();
    const user = session?.user;

    const [students, setStudents] = useState([]);
    const [allStudents, setAllStudents] = useState([]);
    const [tutorials, setTutorials] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // all, active, new, completed
    const [expandedStudent, setExpandedStudent] = useState(null);

    // Redirect to signin if not authenticated
    useEffect(() => {
        if (session === null) {
            navigate("/signin");
        }
    }, [session, navigate]);

    useEffect(() => {
        const fetchStudentsData = async () => {
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
                    supabase.from("users").select("user_id, first_name, last_name, email, user_role, created_at"),
                    supabase.from("categories").select("category_id, category_name, description").order("display_order", { ascending: true }),
                    supabase.from("tutorials").select("tutorial_id, category_id, title, difficulty_level"),
                    supabase.from("user_progress").select("user_id, tutorial_id, status, completed_at, started_at")
                ]);

                // Handle errors
                if (allUsersError) {
                    console.error("Error fetching users:", allUsersError);
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
                setCategories(categoriesData || []);
                setTutorials(tutorialsData || []);

                // Process student data - include ALL students, not just those with progress
                const studentProgressMap = buildStudentProgressMap(progressData);

                // Format students with progress
                const studentsWithProgress = formatStudentsWithProgress(
                    studentsData,
                    studentProgressMap,
                    tutorialsData,
                    categoriesData
                );

                // Also include students without progress
                const studentsWithoutProgress = studentsData
                    .filter(student => !studentProgressMap[student.user_id])
                    .map(student => ({
                        id: student.user_id,
                        name: `${student.first_name} ${student.last_name}`,
                        email: student.email,
                        course: "Not Started",
                        progress: 0,
                        status: "new",
                        lastActivity: null,
                        created_at: student.created_at,
                        completedTutorials: [],
                        inProgressTutorials: [],
                        totalTutorials: tutorialsData?.length || 0
                    }));

                // Combine and sort all students
                const allStudentsList = [
                    ...studentsWithProgress.map(s => {
                        const studentData = studentsData.find(st => st.user_id === s.id);
                        return {
                            ...s,
                            email: studentData?.email || "",
                            created_at: studentData?.created_at || null,
                            completedTutorials: [],
                            inProgressTutorials: [],
                            totalTutorials: tutorialsData?.length || 0
                        };
                    }),
                    ...studentsWithoutProgress
                ];

                // Add detailed progress information
                const studentsWithDetails = allStudentsList.map(student => {
                    const studentProgress = progressData?.filter(p => p.user_id === student.id) || [];
                    const completed = studentProgress.filter(p => p.completed_at !== null);
                    const inProgress = studentProgress.filter(p => p.completed_at === null && p.started_at !== null);

                    const completedTutorials = completed.map(p => {
                        const tutorial = tutorialsData?.find(t => t.tutorial_id === p.tutorial_id);
                        return {
                            tutorial_id: p.tutorial_id,
                            title: tutorial?.title || "Unknown",
                            completed_at: p.completed_at,
                            category: categoriesData?.find(c => c.category_id === tutorial?.category_id)?.category_name || "Unknown"
                        };
                    });

                    const inProgressTutorials = inProgress.map(p => {
                        const tutorial = tutorialsData?.find(t => t.tutorial_id === p.tutorial_id);
                        return {
                            tutorial_id: p.tutorial_id,
                            title: tutorial?.title || "Unknown",
                            started_at: p.started_at,
                            status: p.status,
                            category: categoriesData?.find(c => c.category_id === tutorial?.category_id)?.category_name || "Unknown"
                        };
                    });

                    return {
                        ...student,
                        completedTutorials,
                        inProgressTutorials,
                        completedCount: completed.length,
                        inProgressCount: inProgress.length
                    };
                });

                setAllStudents(studentsWithDetails);
                setStudents(studentsWithDetails);

            } catch (error) {
                console.error("Error fetching students data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudentsData();
    }, [session]);

    // Filter students based on search and status
    useEffect(() => {
        let filtered = [...allStudents];

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(student =>
                student.name.toLowerCase().includes(query) ||
                student.email?.toLowerCase().includes(query) ||
                student.course?.toLowerCase().includes(query)
            );
        }

        // Apply status filter
        if (statusFilter !== "all") {
            filtered = filtered.filter(student => student.status === statusFilter);
        }

        setStudents(filtered);
    }, [searchQuery, statusFilter, allStudents]);

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "bg-emerald-100 text-emerald-700";
            case "completed":
                return "bg-blue-100 text-blue-700";
            case "new":
                return "bg-gray-100 text-gray-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        });
    };

    const toggleStudentExpansion = (studentId) => {
        setExpandedStudent(expandedStudent === studentId ? null : studentId);
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
                        <button
                            onClick={() => navigate("/instructor")}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-sm font-semibold"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 pb-20">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-3">
                        All Students
                    </h1>
                    <p className="text-xl text-gray-600">
                        View and track progress for all students
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-3xl shadow-md p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <User className="w-5 h-5 text-gray-600" />
                            <span className="text-sm font-semibold text-gray-600">Total Students</span>
                        </div>
                        <div className="text-4xl font-black text-gray-900">{allStudents.length}</div>
                    </div>
                    <div className="bg-white rounded-3xl shadow-md p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <TrendingUp className="w-5 h-5 text-emerald-600" />
                            <span className="text-sm font-semibold text-gray-600">Active Students</span>
                        </div>
                        <div className="text-4xl font-black text-gray-900">
                            {allStudents.filter(s => s.status === "active").length}
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl shadow-md p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                            <span className="text-sm font-semibold text-gray-600">Completed</span>
                        </div>
                        <div className="text-4xl font-black text-gray-900">
                            {allStudents.reduce((sum, s) => sum + (s.completedCount || 0), 0)}
                        </div>
                    </div>
                    <div className="bg-white rounded-3xl shadow-md p-6">
                        <div className="flex items-center gap-3 mb-2">
                            <Clock className="w-5 h-5 text-orange-600" />
                            <span className="text-sm font-semibold text-gray-600">In Progress</span>
                        </div>
                        <div className="text-4xl font-black text-gray-900">
                            {allStudents.reduce((sum, s) => sum + (s.inProgressCount || 0), 0)}
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-3xl shadow-sm p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search Bar */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search students by name, email, or course..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>

                        {/* Status Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-5 h-5 text-gray-600" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent font-semibold"
                            >
                                <option value="all">All Status</option>
                                <option value="active">Active</option>
                                <option value="new">New</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Students List */}
                {loading ? (
                    <div className="text-center py-12 text-gray-600">Loading students...</div>
                ) : students.length === 0 ? (
                    <div className="bg-white rounded-3xl shadow-sm p-12 text-center">
                        <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No students found</h3>
                        <p className="text-gray-600">
                            {searchQuery || statusFilter !== "all"
                                ? "Try adjusting your search or filter criteria"
                                : "No students have registered yet"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {students.map((student) => {
                            const initials = student.name.split(' ').map(n => n[0]).join('');
                            const isExpanded = expandedStudent === student.id;

                            return (
                                <div
                                    key={student.id}
                                    className="bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    {/* Student Card Header */}
                                    <div className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="w-14 h-14 bg-linear-to-br from-orange-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                    {initials}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                                                        {student.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mb-1">{student.email}</p>
                                                    <p className="text-sm text-gray-500">
                                                        {student.course} • Joined {formatDate(student.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6">
                                                {/* Progress */}
                                                <div className="text-right">
                                                    <div className="text-2xl font-black text-gray-900 mb-1">
                                                        {student.progress}%
                                                    </div>
                                                    <div className="text-xs text-gray-600">Overall Progress</div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {student.completedCount || 0} completed • {student.inProgressCount || 0} in progress
                                                    </div>
                                                </div>
                                                {/* Status Badge */}
                                                <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(student.status)}`}>
                                                    {student.status}
                                                </span>
                                                {/* Expand Button */}
                                                <button
                                                    onClick={() => toggleStudentExpansion(student.id)}
                                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm font-semibold"
                                                >
                                                    {isExpanded ? "Hide Details" : "View Details"}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mt-4">
                                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                <div
                                                    className="bg-linear-to-r from-orange-400 to-rose-400 h-3 rounded-full transition-all duration-300"
                                                    style={{ width: `${student.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="border-t border-gray-200 bg-gray-50 p-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {/* Completed Tutorials */}
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                                                        Completed Tutorials ({student.completedTutorials?.length || 0})
                                                    </h4>
                                                    {student.completedTutorials && student.completedTutorials.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {student.completedTutorials.map((tutorial) => (
                                                                <div
                                                                    key={tutorial.tutorial_id}
                                                                    className="bg-white rounded-xl p-4 border border-gray-200"
                                                                >
                                                                    <div className="font-semibold text-gray-900 mb-1">
                                                                        {tutorial.title}
                                                                    </div>
                                                                    <div className="text-sm text-gray-600">
                                                                        {tutorial.category} • Completed {formatDate(tutorial.completed_at)}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500 text-sm">No completed tutorials yet</p>
                                                    )}
                                                </div>

                                                {/* In Progress Tutorials */}
                                                <div>
                                                    <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                        <Clock className="w-5 h-5 text-orange-600" />
                                                        In Progress ({student.inProgressTutorials?.length || 0})
                                                    </h4>
                                                    {student.inProgressTutorials && student.inProgressTutorials.length > 0 ? (
                                                        <div className="space-y-2">
                                                            {student.inProgressTutorials.map((tutorial) => (
                                                                <div
                                                                    key={tutorial.tutorial_id}
                                                                    className="bg-white rounded-xl p-4 border border-gray-200"
                                                                >
                                                                    <div className="font-semibold text-gray-900 mb-1">
                                                                        {tutorial.title}
                                                                    </div>
                                                                    <div className="text-sm text-gray-600">
                                                                        {tutorial.category} • Started {formatDate(tutorial.started_at)}
                                                                    </div>
                                                                    <div className="mt-2">
                                                                        <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full font-semibold">
                                                                            {tutorial.status || "in_progress"}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-gray-500 text-sm">No tutorials in progress</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
}
