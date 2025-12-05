import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { UserAuth, supabase } from "../context/AuthContext";
import { startOrUpdateCourse, updateVideoProgress } from "../utils/tutorialProgress";
import DashboardNavbar from "../components/Navbar";
import { ArrowLeft, Star, CheckCircle, Clock } from "lucide-react";
import { formatDuration, getCourseMetadata, getColorClasses } from "../components/AllCourses/utils";

export default function TutorialViewer() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { session } = UserAuth();
    const [tutorial, setTutorial] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userProgress, setUserProgress] = useState(null);
    const [userReview, setUserReview] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const [videoProgress, setVideoProgress] = useState(0);
    
    const videoRef = useRef(null);
    const progressUpdateInterval = useRef(null);

    useEffect(() => {
        if (session === null) {
            navigate("/signin");
            return;
        }

        const fetchTutorial = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch tutorial data
                const { data: tutorialData, error: tutorialError } = await supabase
                    .from("tutorials")
                    .select(`
                        *,
                        categories (
                            category_id,
                            category_name
                        )
                    `)
                    .eq("tutorial_id", id)
                    .single();

                if (tutorialError) {
                    console.error("Error fetching tutorial:", tutorialError);
                    setError("Tutorial not found");
                    return;
                }

                setTutorial(tutorialData);

                // Fetch user progress
                const userId = session.user.id;
                const { data: progressData, error: progressError } = await supabase
                    .from("user_progress")
                    .select("*")
                    .eq("user_id", userId)
                    .eq("tutorial_id", id)
                    .single();

                if (progressError && progressError.code !== 'PGRST116') {
                    console.error("Error fetching progress:", progressError);
                } else if (progressData) {
                    setUserProgress(progressData);
                } else {
                    // Start the course if not already started
                    const result = await startOrUpdateCourse(userId, parseInt(id));
                    if (result.success) {
                        setUserProgress(result.data);
                    }
                }

                // Fetch user's existing review
                const { data: reviewData, error: reviewError } = await supabase
                    .from("tutorial_reviews")
                    .select("*")
                    .eq("user_id", userId)
                    .eq("tutorial_id", id)
                    .single();

                if (reviewError && reviewError.code !== 'PGRST116') {
                    console.error("Error fetching review:", reviewError);
                } else if (reviewData) {
                    setUserReview(reviewData);
                    setRating(reviewData.rating);
                    setComment(reviewData.comment || "");
                }
            } catch (err) {
                console.error("Unexpected error:", err);
                setError("Failed to load tutorial");
            } finally {
                setLoading(false);
            }
        };

        if (session && id) {
            fetchTutorial();
        }
    }, [session, id, navigate]);

    // Extract YouTube video ID from URL
    const getYouTubeVideoId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Handle video progress tracking
    useEffect(() => {
        if (!videoRef.current || !tutorial || !session) return;

        const video = videoRef.current;
        const videoId = getYouTubeVideoId(tutorial.video_url);

        // For YouTube embeds, we'll track based on time updates
        // Note: YouTube iframe API has limitations, so we'll use a simpler approach
        const updateProgress = async () => {
            if (video && video.duration) {
                const currentTime = video.currentTime;
                const duration = video.duration;
                const progress = Math.round((currentTime / duration) * 100);

                if (progress !== videoProgress) {
                    setVideoProgress(progress);
                    
                    // Update database every 10% or when completed
                    if (Math.abs(progress - videoProgress) >= 10 || progress >= 100) {
                        const userId = session.user.id;
                        await updateVideoProgress(userId, parseInt(id), progress);
                    }
                }
            }
        };

        // For YouTube embeds, we can't directly access video element
        // So we'll use a polling approach with iframe messages
        // For now, we'll track based on time spent on page
        if (videoId) {
            // YouTube embed - use time-based tracking
            const startTime = Date.now();
            progressUpdateInterval.current = setInterval(async () => {
                // Estimate progress based on time spent (simplified)
                // In production, you'd want to use YouTube iframe API
                const timeSpent = Date.now() - startTime;
                const estimatedDuration = tutorial.estimated_duration * 60 * 1000; // Convert minutes to ms
                const estimatedProgress = Math.min(100, Math.round((timeSpent / estimatedDuration) * 100));
                
                if (estimatedProgress > videoProgress) {
                    setVideoProgress(estimatedProgress);
                    if (estimatedProgress >= 10 && estimatedProgress % 10 === 0) {
                        const userId = session.user.id;
                        await updateVideoProgress(userId, parseInt(id), estimatedProgress);
                    }
                }
            }, 5000); // Update every 5 seconds
        } else {
            // Direct video - can track directly
            video.addEventListener('timeupdate', updateProgress);
        }

        return () => {
            if (progressUpdateInterval.current) {
                clearInterval(progressUpdateInterval.current);
            }
            if (video) {
                video.removeEventListener('timeupdate', updateProgress);
            }
        };
    }, [tutorial, session, id, videoProgress]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!rating || rating < 1 || rating > 5) {
            alert("Please select a rating");
            return;
        }

        setSubmittingReview(true);
        try {
            const userId = session.user.id;

            if (userReview) {
                // Update existing review
                const { error } = await supabase
                    .from("tutorial_reviews")
                    .update({
                        rating: rating,
                        comment: comment,
                        created_at: new Date().toISOString()
                    })
                    .eq("review_id", userReview.review_id);

                if (error) {
                    console.error("Error updating review:", error);
                    alert("Failed to update review");
                    return;
                }
            } else {
                // Create new review
                const { data, error } = await supabase
                    .from("tutorial_reviews")
                    .insert({
                        user_id: userId,
                        tutorial_id: parseInt(id),
                        rating: rating,
                        comment: comment
                    })
                    .select()
                    .single();

                if (error) {
                    console.error("Error creating review:", error);
                    alert("Failed to submit review");
                    return;
                }
                setUserReview(data);
            }

            alert("Review submitted successfully!");
        } catch (err) {
            console.error("Unexpected error:", err);
            alert("Failed to submit review");
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-b from-orange-50 via-orange-50 to-white">
                <DashboardNavbar />
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-96 bg-gray-200 rounded mb-6"></div>
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !tutorial) {
        return (
            <div className="min-h-screen bg-linear-to-b from-orange-50 via-orange-50 to-white">
                <DashboardNavbar />
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Tutorial Not Found</h1>
                        <Link to="/allcourses" className="text-emerald-600 hover:text-emerald-700">
                            Return to Courses
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const { icon, color } = getCourseMetadata(tutorial.title, tutorial.category_id);
    const colorClasses = getColorClasses(color);
    const videoId = getYouTubeVideoId(tutorial.video_url);
    const isYouTube = !!videoId;
    const embedUrl = isYouTube 
        ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${window.location.origin}`
        : tutorial.video_url;

    return (
        <div className="min-h-screen bg-linear-to-b from-orange-50 via-orange-50 to-white">
            <DashboardNavbar />
            
            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 pb-20">
                {/* Back Button */}
                <Link 
                    to="/allcourses"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-semibold">Back to Courses</span>
                </Link>

                {/* Tutorial Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        {icon && (() => {
                            const IconComponent = icon;
                            return (
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClasses.bg}`}>
                                    <IconComponent className={`w-6 h-6 ${colorClasses.text}`} />
                                </div>
                            );
                        })()}
                        <div>
                            <span className="text-sm font-semibold text-gray-600">
                                {tutorial.categories?.category_name || 'Uncategorized'}
                            </span>
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                        {tutorial.title}
                    </h1>
                    <p className="text-lg text-gray-700 mb-4">{tutorial.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{formatDuration(tutorial.estimated_duration)}</span>
                        </div>
                        {userProgress && (
                            <div className="flex items-center gap-1">
                                {userProgress.completed_at ? (
                                    <>
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                        <span className="text-emerald-600">Completed</span>
                                    </>
                                ) : (
                                    <span>In Progress: {videoProgress}%</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Video Player */}
                <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-900">
                        {isYouTube ? (
                            <iframe
                                ref={videoRef}
                                src={embedUrl}
                                title={tutorial.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <video
                                ref={videoRef}
                                src={tutorial.video_url}
                                controls
                                className="w-full h-full"
                            />
                        )}
                    </div>
                    {!isYouTube && (
                        <div className="mt-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-emerald-500 h-2 rounded-full transition-all"
                                    style={{ width: `${videoProgress}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">Progress: {videoProgress}%</p>
                        </div>
                    )}
                </div>

                {/* Rating and Review Section */}
                <div className="bg-white rounded-3xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        {userReview ? "Update Your Review" : "Rate This Tutorial"}
                    </h2>
                    
                    <form onSubmit={handleSubmitReview} className="space-y-6">
                        {/* Rating Stars */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Rating *
                            </label>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        className={`p-2 rounded-lg transition-colors ${
                                            star <= rating
                                                ? 'text-amber-400 hover:text-amber-500'
                                                : 'text-gray-300 hover:text-gray-400'
                                        }`}
                                    >
                                        <Star className="w-8 h-8 fill-current" />
                                    </button>
                                ))}
                            </div>
                            {rating > 0 && (
                                <p className="text-sm text-gray-600 mt-2">
                                    {rating === 1 && "Poor"}
                                    {rating === 2 && "Fair"}
                                    {rating === 3 && "Good"}
                                    {rating === 4 && "Very Good"}
                                    {rating === 5 && "Excellent"}
                                </p>
                            )}
                        </div>

                        {/* Comment */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                                Comment (Optional)
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                                placeholder="Share your thoughts about this tutorial..."
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submittingReview || !rating}
                            className="w-full py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submittingReview ? "Submitting..." : userReview ? "Update Review" : "Submit Review"}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
}

