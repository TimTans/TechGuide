import { Filter } from "lucide-react";

export default function DifficultyFilter({ difficultyFilter, onFilterChange }) {
    return (
        <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
                value={difficultyFilter}
                onChange={(e) => onFilterChange(e.target.value)}
                className="pl-12 pr-10 py-3 bg-white rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent appearance-none cursor-pointer"
            >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
            </select>
        </div>
    );
}

