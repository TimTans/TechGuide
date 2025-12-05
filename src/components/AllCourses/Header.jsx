import { ArrowLeft } from "lucide-react";

export default function Header({ selectedCategory, onBack }) {
    if (selectedCategory) {
        return (
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={onBack}
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
        );
    }

    return (
        <>
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-3">
                All Courses
            </h1>
            <p className="text-xl text-gray-600">
                Browse courses by category
            </p>
        </>
    );
}

