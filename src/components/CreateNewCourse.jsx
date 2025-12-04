import { AlertTriangle, CheckCircle, Clock, X } from "lucide-react";
import { supabase } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function CreateNewCourse({ isOpen, onClose, onSuccess }) {
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

    // Fetch categories when modal opens
    useEffect(() => {
        if (isOpen) {
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

            fetchCategories();
        }
    }, [isOpen]);

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
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
        }
    }, [isOpen]);

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
            // Check user role before allowing course creation
            const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

            if (authError || !authUser) {
                setError("Authentication error. Please sign in again.");
                setLoading(false);
                return;
            }

            // Fetch user role from users table
            const { data: userData, error: userError } = await supabase
                .from("users")
                .select("user_role")
                .eq("user_id", authUser.id)
                .single();

            if (userError) {
                console.error("Error fetching user role:", userError);
                setError("Error verifying permissions. Please try again.");
                setLoading(false);
                return;
            }

            // Check if user_role is instructor
            if (!userData || userData.user_role !== "instructor") {
                setError("Permission denied");
                setLoading(false);
                return;
            }

            // Proceed with course creation
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
                // Close modal after 1.5 seconds and trigger refresh
                setTimeout(() => {
                    setSuccess("");
                    onClose();
                    if (onSuccess) {
                        onSuccess();
                    }
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

    const handleClose = () => {
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
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            {/* Blur backdrop - clickable to close */}
            <div
                className="fixed inset-0 backdrop-blur-md -z-10"
                onClick={handleClose}
            ></div>
            {/* Modal content */}
            <div
                className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-3xl">
                    <h2 className="text-3xl font-black text-gray-900">Create New Course</h2>
                    <button
                        onClick={handleClose}
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
                            onClick={handleClose}
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
    );
}

