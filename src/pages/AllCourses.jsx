import { useNavigate, useLocation } from "react-router-dom";
import { UserAuth, supabase } from "../context/AuthContext";
import { useEffect, useState } from "react";
import DashboardNavbar from "../components/Navbar";
import LoadingSkeleton from "../components/AllCourses/LoadingSkeleton";
import CategoryCard from "../components/AllCourses/CategoryCard";
import CourseCard from "../components/AllCourses/CourseCard";
import SearchBar from "../components/AllCourses/SearchBar";
import DifficultyFilter from "../components/AllCourses/DifficultyFilter";
import Header from "../components/AllCourses/Header";
import EmptyState from "../components/AllCourses/EmptyState";
import ErrorState from "../components/AllCourses/ErrorState";
import { formatDuration, getCourseMetadata, getCategoryMetadata } from "../components/AllCourses/utils";
import CourseEditingModal from "../components/CourseEditingModal";

export default function AllCourses() {
    const navigate = useNavigate();
    const location = useLocation();
    const { session, getUserData } = UserAuth();
    const [allCourses, setAllCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [userProgress, setUserProgress] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState("all");
    const [userRole, setUserRole] = useState('')
    const [toEdit, setToEdit] = useState({})
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Redirect to signin if not authenticated
    useEffect(() => {
        if (session === null) {
            navigate("/signin");
        }
    }, [session, navigate]);

    getUserData().then((value) => {
        setUserRole(value.data.user_role);
    })


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
                        const categoryData = Array.isArray(course.categories)
                            ? course.categories[0]
                            : course.categories || null;

                        // Get category-specific icon and color
                        const categoryMeta = getCategoryMetadata(course.category_id);

                        categoryMap[catId] = {
                            id: catId,
                            name: catName,
                            description: categoryData?.description || null,
                            displayOrder: categoryData?.display_order || 999,
                            courses: [],
                            totalTutorials: 0,
                            completedTutorials: 0,
                            icon: categoryMeta.icon,
                            color: categoryMeta.color
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
    }, [session, refreshTrigger]);

    // Handle category selection from navigation state
    useEffect(() => {
        if (location.state?.selectedCategoryId && categories.length > 0 && !selectedCategory) {
            const categoryToSelect = categories.find(
                cat => cat.id === location.state.selectedCategoryId
            );
            if (categoryToSelect) {
                setSelectedCategory(categoryToSelect);
                // Clear the location state to prevent re-selecting on re-renders
                window.history.replaceState({}, document.title);
            }
        }
    }, [categories, location.state, selectedCategory]);

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

    // Handler functions
    const handleBackToCategories = () => {
        setSelectedCategory(null);
        setSearchQuery("");
        setDifficultyFilter("all");
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
    };

    const handleCourseClick = (course) => {
        // Navigate to course detail page or tutorial
        navigate(`/tutorials/${course.id}`);
    };

    const handleClearFilters = () => {
        setSearchQuery("");
        setDifficultyFilter("all");
    };

    const handleCourseEdit = (course) => {
        console.log(course)
        setToEdit(course);
        setIsModalOpen(true);
    }
    const handleOnCourseEditSubmit = async (updatedFields) => {
        try {
            const updateData = {};

            if (updatedFields.title !== undefined) {
                updateData.title = updatedFields.title;
            }
            if (updatedFields.description !== undefined) {
                updateData.description = updatedFields.description;
            }
            if (updatedFields.estimated_duration !== undefined) {
                updateData.estimated_duration = updatedFields.estimated_duration;
            }
            if (updatedFields.video_url !== undefined) {
                updateData.video_url = updatedFields.video_url;
            }

            const { error } = await supabase
                .from('tutorials')
                .update(updateData)
                .eq('tutorial_id', toEdit.tutorial_id);

            if (error) {
                console.error('Error updating course:', error);
                alert('Failed to update course. Please try again.');
            } else {
                setIsModalOpen(false);
                // Trigger data refresh
                setRefreshTrigger(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error updating course:', error);
            alert('Failed to update course. Please try again.');
        }
    }

    // Show loading or nothing while checking auth
    if (session === null) {
        return null;
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-orange-50 via-orange-50 to-white">
            <DashboardNavbar />

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 pb-20">
                {/* Header */}
                <div className="mb-8">
                    <Header
                        selectedCategory={selectedCategory}
                        onBack={handleBackToCategories}
                    />
                </div>

                {/* Search and Filter Bar */}
                {!loading && !error && (
                    <div className="mb-8 flex flex-col sm:flex-row gap-4">
                        <SearchBar
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            placeholder={selectedCategory ? "Search courses..." : "Search categories or courses..."}
                        />

                        {/* Difficulty Filter (only show in course view) */}
                        {selectedCategory && (
                            <DifficultyFilter
                                difficultyFilter={difficultyFilter}
                                onFilterChange={setDifficultyFilter}
                            />
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
                    <ErrorState error={error} />
                )}

                {/* Category View */}
                {!loading && !error && !selectedCategory && (
                    <>
                        {filteredCategories.length === 0 ? (
                            <EmptyState
                                message={searchQuery ? "No categories match your search." : "No categories available at the moment."}
                                showClearButton={!!searchQuery}
                                onClear={() => setSearchQuery("")}
                            />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCategories.map((category) => (
                                    <CategoryCard
                                        key={category.id}
                                        category={category}
                                        onSelect={handleCategorySelect}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}

                {/* Course View (when category is selected) */}
                {!loading && !error && selectedCategory && (
                    <>
                        {filteredCourses.length === 0 ? (
                            <EmptyState
                                message={
                                    searchQuery || difficultyFilter !== "all"
                                        ? "No courses match your filters."
                                        : "No courses in this category."
                                }
                                showClearButton={!!(searchQuery || difficultyFilter !== "all")}
                                onClear={handleClearFilters}
                            />
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredCourses.map((course) => (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                        onClick={handleCourseClick}
                                        onEdit={handleCourseEdit}
                                        role={userRole}
                                    />
                                ))}
                            </div>
                        )}


                        {userRole == 'instructor' && <CourseEditingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} courseToEdit={toEdit} onSubmit={handleOnCourseEditSubmit} />}
                    </>
                )}
            </main>
        </div>
    );
}
