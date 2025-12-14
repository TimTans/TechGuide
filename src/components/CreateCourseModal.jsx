import { useState, useEffect } from "react";

export default function CreateCourseModal({ isOpen, onClose, categories = [], onSubmit }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [difficultyLevel, setDifficultyLevel] = useState('Beginner');
    const [estimatedDuration, setEstimatedDuration] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            setTitle('');
            setDescription('');
            setCategoryId('');
            setDifficultyLevel('Beginner');
            setEstimatedDuration('');
            setVideoUrl('');
        }
    }, [isOpen]);

    if (!isOpen) return null

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            title,
            description,
            category_id: categoryId ? parseInt(categoryId) : null,
            difficulty_level: difficultyLevel,
            estimated_duration: estimatedDuration ? parseInt(estimatedDuration) : null,
            video_url: videoUrl
        });
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black opacity-40 backdrop-blur-sm"
                onClick={() => {
                    onClose()
                }}
            ></div>

            {/* Modal */}
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10 p-6"
                onClick={(e) => {
                    e.stopPropagation()
                }}
            >
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Course</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                            Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            type='text'
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter course title"
                            className="w-full flex h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100"
                            required
                            autoFocus
                        />
                    </div>

                    <div>
                        <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                            Category <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="category"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full flex h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100"
                            required
                            disabled={!categories || categories.length === 0}
                        >
                            <option value="">
                                {!categories || categories.length === 0
                                    ? "Loading categories..."
                                    : "Select a category"}
                            </option>
                            {categories && categories.length > 0 && categories.map((category) => (
                                <option key={category.category_id} value={category.category_id}>
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
                        {categories && categories.length === 0 && (
                            <p className="text-xs text-gray-500 mt-1">No categories available. Please contact an administrator.</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="difficultyLevel" className="block text-sm font-semibold text-gray-700 mb-2">
                            Difficulty Level
                        </label>
                        <select
                            id="difficultyLevel"
                            value={difficultyLevel}
                            onChange={(e) => setDifficultyLevel(e.target.value)}
                            className="w-full flex h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100"
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Enter course description"
                            rows={4}
                            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 resize-y"
                        />
                    </div>

                    <div>
                        <label htmlFor="estimatedDuration" className="block text-sm font-semibold text-gray-700 mb-2">
                            Estimated Duration (minutes)
                        </label>
                        <input
                            type='number'
                            id="estimatedDuration"
                            value={estimatedDuration}
                            onChange={(e) => setEstimatedDuration(e.target.value)}
                            placeholder="Enter duration in minutes"
                            min="1"
                            className="w-full flex h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100"
                        />
                    </div>

                    <div>
                        <label htmlFor="videoUrl" className="block text-sm font-semibold text-gray-700 mb-2">
                            Video URL
                        </label>
                        <input
                            type='url'
                            id="videoUrl"
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            placeholder="Enter video URL (e.g., https://www.youtube.com/watch?v=...)"
                            className="w-full flex h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-3 px-4 bg-emerald-500 text-white rounded-full font-semibold hover:bg-emerald-600 transition-colors"
                        >
                            Create Course
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )

}
