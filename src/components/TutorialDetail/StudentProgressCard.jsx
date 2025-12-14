import { CheckCircle, Clock, User } from "lucide-react";
import { formatTimeAgo } from "../../utils/formatTimeAgo";

export default function StudentProgressCard({ student }) {
    const isCompleted = student.completed_at !== null;
    const initials = student.name.split(' ').map(n => n[0]).join('');

    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-orange-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold">
                    {initials}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.email}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    {isCompleted ? (
                        <div className="flex items-center gap-2 text-emerald-600">
                            <CheckCircle className="w-4 h-4" />
                            <span className="text-sm font-semibold">Completed</span>
                        </div>
                    ) : student.started_at ? (
                        <div className="flex items-center gap-2 text-blue-600">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm font-semibold">In Progress</span>
                        </div>
                    ) : (
                        <span className="text-sm font-semibold text-gray-500">Not Started</span>
                    )}
                    {student.completed_at && (
                        <p className="text-xs text-gray-500 mt-1">
                            {formatTimeAgo(student.completed_at)}
                        </p>
                    )}
                    {student.started_at && !student.completed_at && (
                        <p className="text-xs text-gray-500 mt-1">
                            Started {formatTimeAgo(student.started_at)}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
