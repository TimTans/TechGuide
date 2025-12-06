import { ChevronRight } from "lucide-react";
import { getColorClasses } from "./utils";

export default function CategoryCard({ category, onSelect }) {
    const Icon = category.icon;
    const hasProgress = category.completedTutorials > 0;
    const colorClasses = getColorClasses(category.color);

    return (
        <div
            onClick={() => onSelect(category)}
            className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClasses.bg}`}>
                    <Icon className={`w-7 h-7 ${colorClasses.text}`} />
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
                            className={`h-full ${colorClasses.progress}`}
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
}

