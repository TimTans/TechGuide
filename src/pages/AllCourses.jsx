import { Mail, Video, MessageCircle, ShoppingCart, Phone, Globe, Wifi, Shield, ArrowLeft, ChevronRight, Search, Filter, X } from "lucide-react";
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
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [userProgress, setUserProgress] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState("all");

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

    // Fetch tutorials and user progress from Supabase
    useEffect(() => {
        const fetchData = async () => {
            if (session === null) return;

            try {
                setLoading(true);
                setError(null);

                // Fetch tutorials
                const { data: tutorialsData, error: tutorialsError } = await supabase
                    .from("tutorials")
                    .select(`
                        *,
                        categories (
                            category_id,
                            category_name,
                            description,
                            display_order
                        )
                    `)
                    .order("tutorial_id", { ascending: true });

                if (tutorialsError) {
                    console.error("Error fetching tutorials:", tutorialsError);
                    setError(tutorialsError.message);
                    return;
                }

                // Fetch user progress
                const userId = session.user.id;
                const { data: progressData, error: progressError } = await supabase
                    .from("user_progress")
                    .select("tutorial_id, status, completed_at")
                    .eq("user_id", userId);

                if (progressError) {
                    console.error("Error fetching user progress:", progressError);
                    // Continue without progress data
                }

                // Create progress map
                const progressMap = {};
                (progressData || []).forEach(progress => {
                    progressMap[progress.tutorial_id] = {
                        status: progress.status,
                        completed: progress.completed_at !== null
                    };
                });

                setUserProgress(progressMap);

                // Map tutorials with icons, colors, and formatted data
                const coursesWithMetadata = (tutorialsData || []).map(course => {
                    const { icon, color } = getCourseMetadata(course.title, course.category_id);
                    const categoryName = course.categories?.category_name ||
                        (Array.isArray(course.categories) && course.categories[0]?.category_name) ||
                        null;
                    const categoryId = course.category_id;
                    const progress = progressMap[course.tutorial_id] || { status: null, completed: false };

                    return {
                        ...course,
                        id: course.tutorial_id,
                        icon,
                        color,
                        difficulty: course.difficulty_level,
                        duration: formatDuration(course.estimated_duration),
                        category: categoryName,
                        categoryId: categoryId,
                        progress: progress.status,
                        isCompleted: progress.completed
                    };
                });

                setAllCourses(coursesWithMetadata);

                // Group courses by category
                const categoryMap = {};
                coursesWithMetadata.forEach(course => {
                    const catName = course.category || 'Uncategorized';
                    const catId = course.categoryId || 'uncategorized';

                    if (!categoryMap[catId]) {
                        const categoryData = course.categories ||
                            (Array.isArray(course.categories) ? course.categories[0] : null);

                        categoryMap[catId] = {
                            id: catId,
                            name: catName,
                            description: categoryData?.description || null,
                            displayOrder: categoryData?.display_order || 999,
                            courses: [],
                            totalTutorials: 0,
                            completedTutorials: 0,
                            icon: course.icon,
                            color: course.color
                        };
                    }

                    categoryMap[catId].courses.push(course);
                    categoryMap[catId].totalTutorials += 1;
                    if (course.isCompleted) {
                        categoryMap[catId].completedTutorials += 1;
                    }
                });

                // Calculate progress percentage for each category
                const categoriesWithProgress = Object.values(categoryMap).map(cat => ({
                    ...cat,
                    progressPercentage: cat.totalTutorials > 0
                        ? Math.round((cat.completedTutorials / cat.totalTutorials) * 100)
                        : 0
                }));

                // Sort by display_order, then by name
                categoriesWithProgress.sort((a, b) => {
                    if (a.displayOrder !== b.displayOrder) {
                        return a.displayOrder - b.displayOrder;
                    }
                    return a.name.localeCompare(b.name);
                });

                setCategories(categoriesWithProgress);
            } catch (err) {
                console.error("Unexpected error fetching data:", err);
                setError("Failed to load courses. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchData();
        }
    }, [session]);

    // Get filtered courses for selected category
    const getFilteredCourses = () => {
        let courses = selectedCategory
            ? allCourses.filter(course => course.categoryId === selectedCategory.id)
            : allCourses;

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            courses = courses.filter(course =>
                course.title.toLowerCase().includes(query) ||
                course.description?.toLowerCase().includes(query) ||
                course.category?.toLowerCase().includes(query)
            );
        }

        // Apply difficulty filter
        if (difficultyFilter !== "all") {
            courses = courses.filter(course =>
                (course.difficulty || course.difficulty_level || 'Beginner').toLowerCase() === difficultyFilter.toLowerCase()
            );
        }

        return courses;
    };

    const filteredCourses = getFilteredCourses();

    // Get filtered categories (for category view)
    const getFilteredCategories = () => {
        let cats = categories;

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            cats = cats.filter(cat =>
                cat.name.toLowerCase().includes(query) ||
                cat.description?.toLowerCase().includes(query) ||
                cat.courses.some(course =>
                    course.title.toLowerCase().includes(query) ||
                    course.description?.toLowerCase().includes(query)
                )
            );
        }

        return cats;
    };

    const filteredCategories = getFilteredCategories();

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

    // Category Card Component
    const CategoryCard = ({ category }) => {
        const Icon = category.icon;
        const hasProgress = category.completedTutorials > 0;

        return (
            <div
                onClick={() => setSelectedCategory(category)}
                className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col"
            >
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${category.color === 'blue' ? 'bg-blue-100' :
                            category.color === 'purple' ? 'bg-purple-100' :
                                category.color === 'pink' ? 'bg-pink-100' :
                                    category.color === 'emerald' ? 'bg-emerald-100' :
                                        category.color === 'orange' ? 'bg-orange-100' :
                                            category.color === 'indigo' ? 'bg-indigo-100' :
                                                category.color === 'cyan' ? 'bg-cyan-100' :
                                                    'bg-red-100'
                        }`}>
                        <Icon className={`w-7 h-7 ${category.color === 'blue' ? 'text-blue-600' :
                                category.color === 'purple' ? 'text-purple-600' :
                                    category.color === 'pink' ? 'text-pink-600' :
                                        category.color === 'emerald' ? 'text-emerald-600' :
                                            category.color === 'orange' ? 'text-orange-600' :
                                                category.color === 'indigo' ? 'text-indigo-600' :
                                                    category.color === 'cyan' ? 'text-cyan-600' :
                                                        'text-red-600'
                            }`} />
                    </div>
                    {hasProgress && (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                            {category.progressPercentage}% Complete
                        </span>
                    )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                {category.description && (
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">
                        {category.description}
                    </p>
                )}
                <div className="mb-4 mt-auto">
                    <div className="flex justify-between text-xs font-semibold mb-2">
                        <span className="text-gray-600">{category.totalTutorials} {category.totalTutorials === 1 ? 'course' : 'courses'}</span>
                        {hasProgress && (
                            <span className="text-gray-900">{category.completedTutorials} completed</span>
                        )}
                    </div>
                    {hasProgress && (
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                            <div
                                className={`h-full ${category.color === 'blue' ? 'bg-blue-500' :
                                        category.color === 'purple' ? 'bg-purple-500' :
                                            category.color === 'pink' ? 'bg-pink-500' :
                                                category.color === 'emerald' ? 'bg-emerald-500' :
                                                    category.color === 'orange' ? 'bg-orange-500' :
                                                        category.color === 'indigo' ? 'bg-indigo-500' :
                                                            category.color === 'cyan' ? 'bg-cyan-500' :
                                                                'bg-red-500'
                                    }`}
                                style={{ width: `${category.progressPercentage}%` }}
                            ></div>
                        </div>
                    )}
                </div>
                <button className="w-full py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group-hover:gap-3">
                    View Category
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-orange-50 via-orange-50 to-white">
            <DashboardNavbar />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 pb-20">
                {/* Header */}
                <div className="mb-8">
                    {selectedCategory ? (
                        <div className="flex items-center gap-4 mb-6">
                            <button
                                onClick={() => {
                                    setSelectedCategory(null);
                                    setSearchQuery("");
                                    setDifficultyFilter("all");
                                }}
                                className="p-2 hover:bg-white rounded-full transition-colors"
                                aria-label="Back to categories"
                            >
                                <ArrowLeft className="w-6 h-6 text-gray-600" />
                            </button>
                            <div className="flex-1">
                                <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-3">
                                    {selectedCategory.name}
                                </h1>
                                <p className="text-xl text-gray-600">
                                    {selectedCategory.totalTutorials} {selectedCategory.totalTutorials === 1 ? 'course' : 'courses'} available
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-3">
                                All Courses
                            </h1>
                            <p className="text-xl text-gray-600">
                                Browse courses by category
                            </p>
                        </>
                    )}
                </div>

                {/* Search and Filter Bar */}
                {!loading && !error && (
                    <div className="mb-8 flex flex-col sm:flex-row gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder={selectedCategory ? "Search courses..." : "Search categories or courses..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
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

                        {/* Difficulty Filter (only show in course view) */}
                        {selectedCategory && (
                            <div className="relative">
                                <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <select
                                    value={difficultyFilter}
                                    onChange={(e) => setDifficultyFilter(e.target.value)}
                                    className="pl-12 pr-10 py-3 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none cursor-pointer"
                                >
                                    <option value="all">All Levels</option>
                                    <option value="beginner">Beginner</option>
                                    <option value="intermediate">Intermediate</option>
                                    <option value="advanced">Advanced</option>
                                </select>
                            </div>
                        )}
                    </div>
                )}

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

                {/* Category View */}
                {!loading && !error && !selectedCategory && (
                    <>
                        {filteredCategories.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                                <p className="text-gray-600 text-lg mb-2">
                                    {searchQuery ? "No categories match your search." : "No categories available at the moment."}
                                </p>
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery("")}
                                        className="text-gray-900 font-semibold hover:underline"
                                    >
                                        Clear search
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCategories.map((category) => (
                                    <CategoryCard key={category.id} category={category} />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Course View (when category is selected) */}
                {!loading && !error && selectedCategory && (
                    <>
                        {filteredCourses.length === 0 ? (
                            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                                <p className="text-gray-600 text-lg mb-2">
                                    {searchQuery || difficultyFilter !== "all"
                                        ? "No courses match your filters."
                                        : "No courses in this category."}
                                </p>
                                {(searchQuery || difficultyFilter !== "all") && (
                                    <button
                                        onClick={() => {
                                            setSearchQuery("");
                                            setDifficultyFilter("all");
                                        }}
                                        className="text-gray-900 font-semibold hover:underline"
                                    >
                                        Clear filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCourses.map((course) => {
                                    const Icon = course.icon;
                                    const hasProgress = course.isCompleted || course.progress;
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
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${course.difficulty === 'Beginner' || course.difficulty_level === 'Beginner'
                                                        ? 'bg-green-100 text-green-700'
                                                        : course.difficulty === 'Intermediate' || course.difficulty_level === 'Intermediate' ? 'bg-amber-100 text-amber-700'
                                                            : 'bg-red-100 text-red-700'
                                                        }`}>
                                                        {course.difficulty || course.difficulty_level || 'Beginner'}
                                                    </span>
                                                    {hasProgress && (
                                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${course.isCompleted
                                                                ? 'bg-emerald-100 text-emerald-700'
                                                                : 'bg-blue-100 text-blue-700'
                                                            }`}>
                                                            {course.isCompleted ? 'Completed' : 'In Progress'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                                            <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">{course.description}</p>

                                            <div className="mt-auto">
                                                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-4">
                                                    <span>Duration</span>
                                                    <span>{course.duration || 'N/A'}</span>
                                                </div>
                                                <button className="w-full py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group-hover:gap-3">
                                                    {hasProgress ? 'Continue Learning' : 'Start Course'}
                                                    <ChevronRight className="w-5 h-5" />
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

