export default function StudentCard({ student }) {
    const initials = student.name.split(' ').map(n => n[0]).join('');

    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-orange-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold">
                    {initials}
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900">{student.name}</h3>
                    <p className="text-sm text-gray-600">{student.course}</p>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{student.progress}%</div>
                    <div className="text-xs text-gray-600">Progress</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${student.status === 'active'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                    {student.status}
                </span>
            </div>
        </div>
    );
}
