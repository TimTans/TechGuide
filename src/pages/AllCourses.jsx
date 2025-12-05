import { Mail, Video, MessageCircle, ShoppingCart, Phone, Globe, Wifi, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UserAuth, supabase } from "../context/AuthContext";
import { useEffect, useState } from "react";
import DashboardNavbar from "../components/Navbar";

// Icon mapping for database icon names
const iconMap = {
    Mail,
    Video,
    MessageCircle,
    ShoppingCart,
    Phone,
    Globe,
    Wifi,
    Shield
};

export default function AllCourses() {
    const navigate = useNavigate();
    const { session } = UserAuth();
    const [allCourses, setAllCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Redirect to signin if not authenticated
    useEffect(() => {
        if (session === null) {
            navigate("/signin");
        }
    }, [session, navigate]);

    // Helper function to format duration from minutes to readable format
    const formatDuration = (minutes) => {
        if (!minutes) return 'N/A';
        if (minutes < 60) return `${minutes} min`;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (mins === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
        return `${hours}h ${mins}m`;
    };

    // Helper function to get icon and color based on title or category
    const getCourseMetadata = (title, categoryId) => {
        const titleLower = title?.toLowerCase() || '';

        // Determine icon based on title keywords
        let icon = Mail;
        let color = 'blue';

        if (titleLower.includes('email') || titleLower.includes('gmail')) {
            icon = Mail;
            color = 'blue';
        } else if (titleLower.includes('video') || titleLower.includes('call') || titleLower.includes('zoom')) {
            icon = Video;
            color = 'purple';
        } else if (titleLower.includes('social') || titleLower.includes('facebook') || titleLower.includes('instagram')) {
            icon = MessageCircle;
            color = 'pink';
        } else if (titleLower.includes('shop') || titleLower.includes('amazon') || titleLower.includes('ebay')) {
            icon = ShoppingCart;
            color = 'emerald';
        } else if (titleLower.includes('phone') || titleLower.includes('smartphone')) {
            icon = Phone;
            color = 'orange';
        } else if (titleLower.includes('brows') || titleLower.includes('internet') || titleLower.includes('web')) {
            icon = Globe;
            color = 'indigo';
        } else if (titleLower.includes('wifi') || titleLower.includes('connect')) {
            icon = Wifi;
            color = 'cyan';
        } else if (titleLower.includes('safety') || titleLower.includes('scam') || titleLower.includes('fraud') || titleLower.includes('protect')) {
            icon = Shield;
            color = 'red';
        }

        return { icon, color };
    };

    // Fetch tutorials from Supabase
    useEffect(() => {
        const fetchTutorials = async () => {
            if (session === null) return;

            try {
                setLoading(true);
                setError(null);

                const { data, error: fetchError } = await supabase
                    .from("tutorials")
                    .select(`
                        *,
                        categories (
                            category_id,
                            category_name
                        )
                    `)
                    .order("tutorial_id", { ascending: true });

                if (fetchError) {
                    console.error("Error fetching tutorials:", fetchError);
                    setError(fetchError.message);
                    return;
                }

                // Map tutorials with icons, colors, and formatted data
                const coursesWithMetadata = (data || []).map(course => {
                    const { icon, color } = getCourseMetadata(course.title, course.category_id);
                    // Handle category - it might be an object from the join or just the ID
                    const categoryName = course.categories?.category_name ||
                        (Array.isArray(course.categories) && course.categories[0]?.category_name) ||
                        null;
                    return {
                        ...course,
                        id: course.tutorial_id, // Map tutorial_id to id for key prop
                        icon,
                        color,
                        difficulty: course.difficulty_level,
                        duration: formatDuration(course.estimated_duration),
                        category: categoryName
                    };
                });

                setAllCourses(coursesWithMetadata);
            } catch (err) {
                console.error("Unexpected error fetching tutorials:", err);
                setError("Failed to load tutorials. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchTutorials();
        }
    }, [session]);

    // Show loading or nothing while checking auth
    if (session === null) {
        return null;
    }

    // Loading skeleton component
    const LoadingSkeleton = () => (
        <div className="bg-white rounded-3xl p-6 shadow-sm animate-pulse flex flex-col">
            <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gray-200"></div>
                <div className="w-20 h-6 rounded-full bg-gray-200"></div>
            </div>
            {/* Title skeleton */}
            <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
            {/* Category skeleton */}
            <div className="h-4 bg-gray-200 rounded mb-3 w-24"></div>
            {/* Description skeleton - multiple lines */}
            <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
            <div className="mt-auto">
                <div className="flex justify-between mb-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded-full"></div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-linear-to-b from-orange-50 via-orange-50 to-white">
            <DashboardNavbar />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 pb-20">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-3">
                        All Courses
                    </h1>
                    <p className="text-xl text-gray-600">
                        Explore all available technology tutorials
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <LoadingSkeleton key={index} />
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                        <p className="text-red-600 font-semibold mb-2">Error loading courses</p>
                        <p className="text-red-500 text-sm">{error}</p>
                    </div>
                )}

                {/* Courses Grid */}
                {!loading && !error && (
                    <>
                        {allCourses.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                                <p className="text-gray-600 text-lg">No courses available at the moment.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {allCourses.map((course) => {
                                    const Icon = course.icon;
                                    return (
                                        <div
                                            key={course.id}
                                            className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${course.color === 'blue' ? 'bg-blue-100' :
                                                    course.color === 'purple' ? 'bg-purple-100' :
                                                        course.color === 'pink' ? 'bg-pink-100' :
                                                            course.color === 'emerald' ? 'bg-emerald-100' :
                                                                course.color === 'orange' ? 'bg-orange-100' :
                                                                    course.color === 'indigo' ? 'bg-indigo-100' :
                                                                        course.color === 'cyan' ? 'bg-cyan-100' :
                                                                            'bg-red-100'
                                                    }`}>
                                                    <Icon className={`w-7 h-7 ${course.color === 'blue' ? 'text-blue-600' :
                                                        course.color === 'purple' ? 'text-purple-600' :
                                                            course.color === 'pink' ? 'text-pink-600' :
                                                                course.color === 'emerald' ? 'text-emerald-600' :
                                                                    course.color === 'orange' ? 'text-orange-600' :
                                                                        course.color === 'indigo' ? 'text-indigo-600' :
                                                                            course.color === 'cyan' ? 'text-cyan-600' :
                                                                                'text-red-600'
                                                        }`} />
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${course.difficulty === 'Beginner' || course.difficulty_level === 'Beginner'
                                                    ? 'bg-green-100 text-green-700'
                                                    : course.difficulty === 'Intermediate' || course.difficulty_level === 'Intermediate' ? 'bg-amber-100 text-amber-700'
                                                        : 'bg-red-100 text-red-700'
                                                    }`}>
                                                    {course.difficulty || course.difficulty_level || 'Beginner'}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                                            {course.category && (
                                                <div className="mb-2">
                                                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                                        {course.category}
                                                    </span>
                                                </div>
                                            )}
                                            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{course.description}</p>

                                            <div className="mt-auto">
                                                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-4">
                                                    <span>Duration</span>
                                                    <span>{course.duration || 'N/A'}</span>
                                                </div>
                                                <button className="w-full py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors">
                                                    View Course
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}

