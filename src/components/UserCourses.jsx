import { useEffect, useState } from "react";
import { UserAuth, supabase } from "../context/AuthContext";
import { getCategoryMetadata, getColorClasses } from "./AllCourses/utils";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CategoryCard from "./AllCourses/CategoryCard";

export default function UserCourses() {
    const { session } = UserAuth();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserCategories = async () => {
            if (!session?.user) {
                setLoading(false);
                return;
            }

            try {
                const userId = session.user.id;

                // Fetch all tutorials with their categories
                const { data: tutorialsData, error: tutorialsError } = await supabase
                    .from("tutorials")
                    .select(`
                        tutorial_id,
                        category_id,
                        categories (
                            category_id,
                            category_name,
                            description,
                            display_order
                        )
                    `);

                if (tutorialsError) {
                    console.error("Error fetching tutorials:", tutorialsError);
                    setCategories([]);
                    return;
                }

                // Fetch user progress
                const { data: progressData, error: progressError } = await supabase
                    .from("user_progress")
                    .select("tutorial_id, status, completed_at, started_at")
                    .eq("user_id", userId);

                if (progressError) {
                    console.error("Error fetching user progress:", progressError);
                    setCategories([]);
                    return;
                }

                // Create a map of tutorial progress
                const progressMap = {};
                (progressData || []).forEach(progress => {
                    progressMap[progress.tutorial_id] = {
                        status: progress.status,
                        completed: progress.completed_at !== null,
                        started: progress.started_at !== null || progress.completed_at !== null
                    };
                });

                // Group tutorials by category and calculate progress
                const categoryMap = {};
                (tutorialsData || []).forEach(tutorial => {
                    const categoryId = tutorial.category_id;
                    const categoryData = Array.isArray(tutorial.categories)
                        ? tutorial.categories[0]
                        : tutorial.categories || null;

                    if (!categoryId || !categoryData) return;

                    const catId = categoryId;
                    const catName = categoryData.category_name || 'Uncategorized';

                    if (!categoryMap[catId]) {
                        const categoryMeta = getCategoryMetadata(categoryId);
                        categoryMap[catId] = {
                            id: catId,
                            name: catName,
                            description: categoryData.description || null,
                            displayOrder: categoryData.display_order || 999,
                            totalTutorials: 0,
                            completedTutorials: 0,
                            startedTutorials: 0,
                            icon: categoryMeta.icon,
                            color: categoryMeta.color
                        };
                    }

                    categoryMap[catId].totalTutorials += 1;
                    const progress = progressMap[tutorial.tutorial_id];
                    if (progress?.completed) {
                        categoryMap[catId].completedTutorials += 1;
                    }
                    if (progress?.started) {
                        categoryMap[catId].startedTutorials += 1;
                    }
                });

                // Filter to only categories that have been started, and calculate progress
                const startedCategories = Object.values(categoryMap)
                    .filter(cat => cat.startedTutorials > 0)
                    .map(cat => {
                        const progressPercentage = cat.totalTutorials > 0
                            ? Math.round((cat.completedTutorials / cat.totalTutorials) * 100)
                            : 0;
                        return {
                            ...cat,
                            progressPercentage,
                            buttonText: `${progressPercentage}% Complete`
                        };
                    })
                    // Sort by display_order, then by name
                    .sort((a, b) => {
                        if (a.displayOrder !== b.displayOrder) {
                            return a.displayOrder - b.displayOrder;
                        }
                        return a.name.localeCompare(b.name);
                    });

                setCategories(startedCategories);
            } catch (error) {
                console.error("Unexpected error fetching user categories:", error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchUserCategories();
        }
    }, [session]);

    const handleCategorySelect = (category) => {
        navigate("/allcourses", { state: { selectedCategoryId: category.id } });
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

    if (categories.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 mb-4">You haven't started any categories yet.</p>
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
            {categories.map((category) => (
                <CategoryCard
                    key={category.id}
                    category={category}
                    onSelect={handleCategorySelect}
                />
            ))}
        </div>
    );
}

