import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { UserAuth, supabase } from "../context/AuthContext";
import DashboardNavbar from "../components/Navbar";
import { ArrowLeft, Home, Play, CheckCircle, Clock, Users } from "lucide-react";
import StudentProgressCard from "../components/TutorialDetail/StudentProgressCard";

export default function TutorialDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { session, getUserData } = UserAuth();
    const [tutorial, setTutorial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userProgress, setUserProgress] = useState(null);
    const [isCompleting, setIsCompleting] = useState(false);
    const [completeMessage, setCompleteMessage] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [studentProgress, setStudentProgress] = useState([]);
    const [loadingProgress, setLoadingProgress] = useState(false);

    useEffect(() => {
        const fetchTutorial = async () => {
            if (!session?.user) {
                setError("Please sign in to view tutorials");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const tutorialId = parseInt(id);
                if (isNaN(tutorialId)) {
                    setError("Invalid tutorial ID");
                    setLoading(false);
                    return;
                }

                // Fetch tutorial data
                const { data: tutorialData, error: tutorialError } = await supabase
                    .from("tutorials")
                    .select(`
                        *,
                        categories (
                            category_id,
                            category_name,
                            description
                        )
                    `)
                    .eq("tutorial_id", tutorialId)
                    .single();

                if (tutorialError) {
                    console.error("Error fetching tutorial:", tutorialError);
                    setError("Tutorial not found");
                    setLoading(false);
                    return;
                }

                if (!tutorialData) {
                    setError("Tutorial not found");
                    setLoading(false);
                    return;
                }

                setTutorial(tutorialData);

                // Get user role first
                const userDataResult = await getUserData();
                const isInstructor = userDataResult.success && userDataResult.data.user_role === "instructor";
                setUserRole(userDataResult.success ? userDataResult.data.user_role : null);

                const userId = session.user.id;

                // If instructor, fetch all student progress for this tutorial
                if (isInstructor) {
                    setLoadingProgress(true);
                    const { data: allProgress, error: studentProgressError } = await supabase
                        .from("user_progress")
                        .select(`
                            *,
                            users (
                                user_id,
                                first_name,
                                last_name,
                                email
                            )
                        `)
                        .eq("tutorial_id", tutorialId);

                    if (studentProgressError) {
                        console.error("Error fetching student progress:", studentProgressError);
                        // Check if it's an RLS policy error
                        if (studentProgressError.code === '42501' || studentProgressError.message?.includes('permission denied') || studentProgressError.message?.includes('policy')) {
                            console.error("RLS Policy Error: Instructors need permission to view all student progress. Please check your Supabase RLS policies.");
                        }
                    } else {
                        // Format and deduplicate student progress data
                        // Group by user_id to ensure each student appears only once
                        const progressMap = new Map();

                        (allProgress || []).forEach(progress => {
                            const userId = progress.user_id;
                            const existing = progressMap.get(userId);

                            // If no existing record, add this one
                            if (!existing) {
                                progressMap.set(userId, {
                                    user_id: userId,
                                    name: `${progress.users?.first_name || ''} ${progress.users?.last_name || ''}`.trim() || 'Unknown User',
                                    email: progress.users?.email || '',
                                    started_at: progress.started_at,
                                    completed_at: progress.completed_at,
                                    status: progress.status
                                });
                            } else {
                                // If existing record, prioritize completed over in-progress
                                // If current is completed and existing is not, replace
                                if (progress.completed_at && !existing.completed_at) {
                                    progressMap.set(userId, {
                                        user_id: userId,
                                        name: `${progress.users?.first_name || ''} ${progress.users?.last_name || ''}`.trim() || 'Unknown User',
                                        email: progress.users?.email || '',
                                        started_at: progress.started_at || existing.started_at,
                                        completed_at: progress.completed_at,
                                        status: progress.status
                                    });
                                }
                                // If both are completed or both are in-progress, use the most recent
                                else if (progress.completed_at && existing.completed_at) {
                                    const currentDate = new Date(progress.completed_at);
                                    const existingDate = new Date(existing.completed_at);
                                    if (currentDate > existingDate) {
                                        progressMap.set(userId, {
                                            ...existing,
                                            completed_at: progress.completed_at,
                                            status: progress.status
                                        });
                                    }
                                }
                            }
                        });

                        const formattedProgress = Array.from(progressMap.values());
                        setStudentProgress(formattedProgress);
                    }
                    setLoadingProgress(false);
                } else {
                    // For non-instructors, fetch their own progress
                    const { data: progressData, error: progressError } = await supabase
                        .from("user_progress")
                        .select("*")
                        .eq("user_id", userId)
                        .eq("tutorial_id", tutorialId)
                        .maybeSingle();

                    if (progressError && progressError.code !== 'PGRST116') {
                        // PGRST116 is "not found" which is fine for new tutorials
                        console.error("Error fetching progress:", progressError);
                    } else {
                        setUserProgress(progressData || null);
                    }

                    // Mark tutorial as started if not already
                    if (!progressData) {
                        const { error: insertError } = await supabase
                            .from("user_progress")
                            .insert({
                                user_id: userId,
                                tutorial_id: tutorialId,
                                status: "in_progress",
                                started_at: new Date().toISOString()
                            });

                        if (insertError) {
                            console.error("Error marking as started:", insertError);
                        } else {
                            // Refresh progress after insert
                            const { data: newProgress } = await supabase
                                .from("user_progress")
                                .select("*")
                                .eq("user_id", userId)
                                .eq("tutorial_id", tutorialId)
                                .maybeSingle();
                            setUserProgress(newProgress || null);
                        }
                    }
                }
            } catch (err) {
                console.error("Unexpected error:", err);
                setError("Failed to load tutorial. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        if (session !== null) {
            fetchTutorial();
        }
    }, [id, session]);

    const handleMarkComplete = async () => {
        if (!session?.user || !tutorial || isCompleting) return;

        setIsCompleting(true);
        setCompleteMessage(null);

        try {
            const userId = session.user.id;
            const tutorialId = parseInt(id);
            const completedAt = new Date().toISOString();
            const startedAt = userProgress?.started_at || completedAt;

            // First, try to update existing record
            const { data: updateData, error: updateError } = await supabase
                .from("user_progress")
                .update({
                    status: "completed",
                    completed_at: completedAt
                })
                .eq("user_id", userId)
                .eq("tutorial_id", tutorialId)
                .select()
                .single();

            let finalData = updateData;
            let finalError = updateError;

            // If no record exists, insert a new one
            if (updateError && updateError.code === 'PGRST116') {
                const { data: insertData, error: insertError } = await supabase
                    .from("user_progress")
                    .insert({
                        user_id: userId,
                        tutorial_id: tutorialId,
                        status: "completed",
                        completed_at: completedAt,
                        started_at: startedAt
                    })
                    .select()
                    .single();

                finalData = insertData;
                finalError = insertError;
            }

            if (finalError) {
                console.error("Error marking complete:", finalError);
                setCompleteMessage({ type: "error", text: "Failed to mark as complete. Please try again." });
            } else {
                // Use the returned data if available, otherwise refresh
                let updatedProgress = finalData;

                // If we don't have the data, refresh it
                if (!updatedProgress) {
                    const { data: refreshedProgress, error: refreshError } = await supabase
                        .from("user_progress")
                        .select("*")
                        .eq("user_id", userId)
                        .eq("tutorial_id", tutorialId)
                        .maybeSingle();

                    if (refreshError) {
                        console.error("Error refreshing progress:", refreshError);
                    } else {
                        updatedProgress = refreshedProgress;
                    }
                }

                // Update progress state with the latest data
                if (updatedProgress) {
                    setUserProgress(updatedProgress);
                    console.log("Progress updated:", updatedProgress);
                } else {
                    // Fallback: create the expected structure
                    setUserProgress({
                        user_id: userId,
                        tutorial_id: tutorialId,
                        status: "completed",
                        completed_at: completedAt,
                        started_at: startedAt
                    });
                }

                setCompleteMessage({ type: "success", text: "Tutorial marked as complete! ✓" });

                // Clear message after 3 seconds
                setTimeout(() => {
                    setCompleteMessage(null);
                }, 3000);
            }
        } catch (err) {
            console.error("Error:", err);
            setCompleteMessage({ type: "error", text: "An unexpected error occurred. Please try again." });
        } finally {
            setIsCompleting(false);
        }
    };

    // Early returns - must come before any calculations that depend on tutorial
    if (session === null) {
        return null;
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-orange-50 via-orange-50 to-white">
                <DashboardNavbar />
                <main className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
                        <div className="aspect-video bg-gray-200 rounded-lg mb-6"></div>
                        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                </main>
            </div>
        );
    }

    if (error || !tutorial) {
        return (
            <div className="min-h-screen bg-linear-to-b from-orange-50 via-orange-50 to-white">
                <DashboardNavbar />
                <main className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Tutorial Not Found</h1>
                        <p className="text-gray-600 mb-6">{error || "The tutorial you're looking for doesn't exist."}</p>
                        <button
                            onClick={() => navigate("/allcourses")}
                            className="px-6 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Courses
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    // All calculations that depend on tutorial - only reached if tutorial exists
    // Extract YouTube video ID from URL if it exists
    const getVideoUrl = () => {
        // Check various possible field names for video URL
        const videoUrl = tutorial.video_url || tutorial.url || tutorial.videoUrl || tutorial.youtube_url;

        if (!videoUrl) return null;

        // If it's already a full YouTube URL, return it
        if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
            return videoUrl;
        }

        // If it's just a video ID, construct the URL
        return `https://www.youtube.com/watch?v=${videoUrl}`;
    };

    // Extract YouTube video ID for embedding
    const getYouTubeVideoId = (url) => {
        if (!url) return null;

        // Handle youtu.be short URLs
        if (url.includes('youtu.be/')) {
            const match = url.match(/youtu\.be\/([^?&]+)/);
            return match ? match[1] : null;
        }

        // Handle youtube.com URLs
        if (url.includes('youtube.com')) {
            // Try watch?v= format
            const watchMatch = url.match(/[?&]v=([^&]+)/);
            if (watchMatch) return watchMatch[1];

            // Try embed format
            const embedMatch = url.match(/\/embed\/([^?&]+)/);
            if (embedMatch) return embedMatch[1];
        }

        // If it's just an ID, return it
        if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
            return url;
        }

        return null;
    };

    const videoUrl = getVideoUrl();
    const videoId = videoUrl ? getYouTubeVideoId(videoUrl) : null;
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    const categoryName = tutorial.categories?.category_name ||
        (Array.isArray(tutorial.categories) && tutorial.categories[0]?.category_name) ||
        "Uncategorized";

    // Check completion status - handle both object and direct property access
    const isCompleted = userProgress?.completed_at !== null && userProgress?.completed_at !== undefined;

    return (
        <div className="min-h-screen bg-linear-to-b from-orange-50 via-orange-50 to-white">
            <DashboardNavbar />

            <main className="max-w-4xl mx-auto px-6 lg:px-8 py-12 pb-20">
                {/* Breadcrumb */}
                <div className="flex items-center gap-4 mb-6">
                    <Link to="/" className="text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1">
                        <Home className="w-4 h-4" /> Home
                    </Link>
                    <span className="text-gray-400">/</span>
                    <Link to="/allcourses" className="text-sm font-semibold text-gray-500 hover:text-gray-900">
                        Courses
                    </Link>
                    <span className="text-gray-400">/</span>
                    <span className="text-sm font-semibold text-emerald-700">{tutorial.title}</span>
                </div>

                {/* Back Button */}
                <button
                    onClick={() => navigate("/allcourses")}
                    className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-semibold">Back to Courses</span>
                </button>

                {/* Tutorial Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                            {categoryName}
                        </span>
                        {tutorial.difficulty_level && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                {tutorial.difficulty_level}
                            </span>
                        )}
                        {isCompleted && (
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" />
                                Completed
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{tutorial.title}</h1>
                    {tutorial.estimated_duration && (
                        <div className="flex items-center gap-2 text-gray-600 mb-4">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm">Duration: {tutorial.estimated_duration} minutes</span>
                        </div>
                    )}
                </div>

                {/* Video Section */}
                {videoUrl && embedUrl ? (
                    <div className="mb-8">
                        <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden mb-4 shadow-lg">
                            <iframe
                                src={embedUrl}
                                title={tutorial.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <a
                            href={videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center gap-2"
                        >
                            <Play className="w-4 h-4" />
                            Watch on YouTube
                        </a>
                    </div>
                ) : videoUrl ? (
                    <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <p className="text-yellow-800 mb-2">
                            Unable to parse video URL.
                        </p>
                        <a
                            href={videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center gap-2"
                        >
                            <Play className="w-4 h-4" />
                            Open Video Link
                        </a>
                    </div>
                ) : (
                    <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                        <p className="text-yellow-800">
                            No video URL found for this tutorial. Please contact support if you believe this is an error.
                        </p>
                    </div>
                )}

                {/* Description */}
                {tutorial.description && (
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Tutorial</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {tutorial.description}
                        </p>
                    </div>
                )}

                {/* Student Progress Section (Instructor View) */}
                {userRole === "instructor" && (
                    <div className="mb-8 bg-white rounded-3xl shadow-sm p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Users className="w-6 h-6 text-gray-900" />
                            <h2 className="text-2xl font-bold text-gray-900">Student Progress</h2>
                        </div>
                        {loadingProgress ? (
                            <div className="text-center py-12 text-gray-600">Loading student progress...</div>
                        ) : studentProgress.length === 0 ? (
                            <div className="text-center py-12 text-gray-600">
                                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p>No students have started this tutorial yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                                    <div className="text-sm text-gray-600">
                                        <span className="font-semibold text-gray-900">{studentProgress.length}</span> student{studentProgress.length !== 1 ? 's' : ''} enrolled
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        <span className="font-semibold text-emerald-600">
                                            {studentProgress.filter(s => s.completed_at).length}
                                        </span> completed
                                    </div>
                                </div>
                                {studentProgress
                                    .sort((a, b) => {
                                        // Sort: completed first, then by completion date, then by start date
                                        if (a.completed_at && !b.completed_at) return -1;
                                        if (!a.completed_at && b.completed_at) return 1;
                                        if (a.completed_at && b.completed_at) {
                                            return new Date(b.completed_at) - new Date(a.completed_at);
                                        }
                                        if (a.started_at && b.started_at) {
                                            return new Date(b.started_at) - new Date(a.started_at);
                                        }
                                        return 0;
                                    })
                                    .map((student) => (
                                        <StudentProgressCard key={student.user_id} student={student} />
                                    ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Success/Error Message */}
                {completeMessage && (
                    <div className={`mt-6 p-4 rounded-xl ${completeMessage.type === "success"
                        ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                        : "bg-red-50 border border-red-200 text-red-800"
                        }`}>
                        <p className="font-semibold">{completeMessage.text}</p>
                    </div>
                )}

                {/* Complete Button (only for non-instructors) */}
                {!isCompleted && userRole !== "instructor" && (
                    <div className="mt-8">
                        <button
                            onClick={handleMarkComplete}
                            disabled={isCompleting}
                            className={`w-full sm:w-auto px-8 py-3 rounded-full font-semibold transition-colors flex items-center justify-center gap-2 ${isCompleting
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-emerald-600 text-white hover:bg-emerald-700"
                                }`}
                        >
                            {isCompleting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Marking Complete...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    Mark as Complete
                                </>
                            )}
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}
