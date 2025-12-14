import { ChevronRight, Pencil } from "lucide-react";
import { getColorClasses, getDifficultyBadgeClasses } from "./utils";
import CourseEditingModal from "../CourseEditingModal";
import { UserAuth } from "../../context/AuthContext";
import { useState } from "react";

export default function CourseCard({ course, onClick, onEdit, role }) {
    const Icon = course.icon;
    const hasProgress = course.isCompleted || course.progress;
    const colorClasses = getColorClasses(course.color);
    const difficulty = course.difficulty || course.difficulty_level || 'Beginner';
    const { getUserData } = UserAuth()

    return (
        <div
            onClick={() => onClick?.(course)}
            className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group flex flex-col"
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colorClasses.bg}`}>
                    <Icon className={`w-7 h-7 ${colorClasses.text}`} />
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyBadgeClasses(difficulty)}`}>
                        {difficulty}
                    </span>
                    {role == 'instructor' &&
                        <button className='hover:bg-black transition-all'
                            onClick={(e) => {
                                e.stopPropagation()
                                onEdit(course);
                            }}
                        >
                            <Pencil className="w-3/4 m-auto"></Pencil>
                        </button>
                    }

                    {hasProgress && role !== 'instructor' && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${course.isCompleted
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-blue-100 text-blue-700'
                            }`}>
                            {course.isCompleted ? 'Completed' : 'In Progress'}
                        </span>
                    )}
                </div>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">{course.description}</p>

            <div className="mt-auto">
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-4">
                    <span>Duration</span>
                    <span>{course.duration || 'N/A'}</span>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onClick?.(course);
                    }}
                    className={`w-full py-3 rounded-full font-semibold transition-colors flex items-center justify-center gap-2 group-hover:gap-3 ${role === 'instructor'
                            ? 'bg-gray-900 text-white hover:bg-gray-800'
                            : course.isCompleted
                                ? 'bg-emerald-700 text-white hover:bg-emerald-800'
                                : 'bg-gray-900 text-white hover:bg-gray-800'
                        }`}
                >
                    {role === 'instructor'
                        ? 'View Course'
                        : course.isCompleted
                            ? 'Completed'
                            : hasProgress
                                ? 'Continue Learning'
                                : 'Start Course'}
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>




        </div>
    );
}

