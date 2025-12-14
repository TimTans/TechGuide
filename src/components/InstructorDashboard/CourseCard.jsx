import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getColorClasses } from "../../utils/colorClasses";

export default function CourseCard({ course }) {
    const navigate = useNavigate();
    const Icon = course.icon;
    const colors = getColorClasses(course.color);

    const handleManageCourse = (e) => {
        e.stopPropagation();
        navigate("/allcourses", { state: { selectedCategoryId: course.id } });
    };

    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
            <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${colors.bg}`}>
                    <Icon className={`w-7 h-7 ${colors.text}`} />
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                    {course.students} Students
                </span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">{course.description}</p>

            <div className="mb-4">
                <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-gray-600">Average Progress</span>
                    <span className="text-gray-900">{course.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${colors.progress}`}
                        style={{ width: `${course.progress}%` }}
                    />
                </div>
            </div>

            <button
                onClick={handleManageCourse}
                className="w-full py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group-hover:gap-3"
            >
                Manage Course
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );
}
