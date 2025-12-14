import { useState, useEffect } from "react";



export default function CourseEditingModal({ isOpen, onClose, courseToEdit, onSubmit }) {
    if (!isOpen) return null

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [estimatedDuration, setEstimatedDuration] = useState('');
    const [videoUrl, setVideoUrl] = useState('');

    // Initialize form fields when courseToEdit changes
    useEffect(() => {
        if (courseToEdit) {
            setTitle(courseToEdit.title || '');
            setDescription(courseToEdit.description || '');
            setEstimatedDuration(courseToEdit.estimated_duration || '');
            setVideoUrl(courseToEdit.video_url || '');
        }
    }, [courseToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            title,
            description,
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Edit Course</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                            Title
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
                            Save Changes
                        </button>
                    </div>
                </form>

            </div>
        </div>
    )

}