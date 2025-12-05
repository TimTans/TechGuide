import { useEffect, useState } from "react";
import { UserAuth, supabase } from "../context/AuthContext";
import { formatDuration, getCourseMetadata, getColorClasses } from "./AllCourses/utils";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserCourses() {
    const { session } = UserAuth();
    const navigate = useNavigate();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserCourses = async () => {
            if (!session?.user) {
                setLoading(false);
                return;
            }

            try {
                const userId = session.user.id;

                // Fetch user progress with tutorial details
                const { data: progressData, error: progressError } = await supabase
                    .from("user_progress")
                    .select(`
                        *,
                        tutorials (
                            tutorial_id,
                            title,
                            description,
                            difficulty_level,
                            estimated_duration,
                            category_id,
                            categories (
                                category_id,
                                category_name
                            )
                        )
                    `)
                    .eq("user_id", userId);

                if (progressError) {
                    console.error("Error fetching user courses:", progressError);
                    setCourses([]);
                    return;
                }

                // Transform the data to match the dashboard format
                const formattedCourses = (progressData || [])
                    .filter(item => item.tutorials) // Filter out any null tutorials
                    .map(item => {
                        const tutorial = item.tutorials;
                        const { icon, color } = getCourseMetadata(tutorial.title, tutorial.category_id);
                        const colorClasses = getColorClasses(color);

                        // Calculate progress percentage
                        let progressPercentage = 0;
                        if (item.completed_at) {
                            progressPercentage = 100;
                        } else if (item.started_at) {
                            // If started but not completed, use a default progress
                            // You can enhance this later with more sophisticated calculations
                            progressPercentage = 25; // Default to 25% for in-progress courses
                        }

                        // Get category name
                        const categoryName = tutorial.categories?.category_name ||
                            (Array.isArray(tutorial.categories) && tutorial.categories[0]?.category_name) ||
                            null;

                        return {
                            id: tutorial.tutorial_id,
                            title: tutorial.title,
                            description: tutorial.description,
                            icon,
                            color,
                            progress: progressPercentage,
                            lessons: 1, // Default to 1, you can enhance this later if you have lesson data
                            difficulty: tutorial.difficulty_level || 'Beginner',
                            duration: formatDuration(tutorial.estimated_duration),
                            category: categoryName,
                            status: item.status,
                            completed_at: item.completed_at,
                            started_at: item.started_at,
                            colorClasses
                        };
                    })
                    // Sort: completed courses first (by completion date), then in-progress (by start date), most recent first
                    .sort((a, b) => {
                        // Completed courses first
                        if (a.completed_at && !b.completed_at) return -1;
                        if (!a.completed_at && b.completed_at) return 1;

                        // If both completed, sort by completion date (most recent first)
                        if (a.completed_at && b.completed_at) {
                            return new Date(b.completed_at) - new Date(a.completed_at);
                        }

                        // If both in progress, sort by start date (most recent first)
                        if (a.started_at && b.started_at) {
                            return new Date(b.started_at) - new Date(a.started_at);
                        }

                        // If one has started_at and the other doesn't, prioritize the one with started_at
                        if (a.started_at && !b.started_at) return -1;
                        if (!a.started_at && b.started_at) return 1;

                        return 0;
                    });

                setCourses(formattedCourses);
            } catch (error) {
                console.error("Unexpected error fetching user courses:", error);
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchUserCourses();
        }
    }, [session]);

    const handleCourseClick = (course) => {
        navigate(`/tutorials/${course.id}`);
    };

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="bg-white rounded-3xl p-6 shadow-sm animate-pulse">
                        <div className="h-14 w-14 bg-gray-200 rounded-2xl mb-4"></div>
                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4"></div>
                        <div className="h-2 bg-gray-200 rounded mb-4"></div>
                        <div className="h-10 bg-gray-200 rounded-full"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (courses.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 mb-4">You haven't started any courses yet.</p>
                <button
                    onClick={() => navigate("/allcourses")}
                    className="px-6 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                >
                    Browse Courses
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((tutorial) => {
                const Icon = tutorial.icon;
                const hasProgress = tutorial.progress > 0;
                const colorClasses = tutorial.colorClasses || getColorClasses(tutorial.color);

                return (
                    <div
                        key={tutorial.id}
                        className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col"
                        onClick={() => handleCourseClick(tutorial)}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClasses.bg}`}>
                                <Icon className={`w-7 h-7 ${colorClasses.text}`} />
                            </div>
                            {hasProgress && (
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                                    {tutorial.completed_at ? 'Completed' : 'In Progress'}
                                </span>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{tutorial.title}</h3>
                        <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">{tutorial.description}</p>

                        <div className="mb-4 mt-auto">
                            <div className="flex justify-between text-xs font-semibold mb-2">
                                <span className="text-gray-600">{tutorial.duration || 'N/A'}</span>
                                <span className="text-gray-900">{tutorial.progress}% Complete</span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${colorClasses.progress}`}
                                    style={{ width: `${tutorial.progress}%` }}
                                ></div>
                            </div>
                        </div>

                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleCourseClick(tutorial);
                            }}
                            className="w-full py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group-hover:gap-3"
                        >
                            {hasProgress ? 'Continue Learning' : 'Start Course'}
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

