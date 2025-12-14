export default function ActivityCard({ activity }) {
    const Icon = activity.icon;

    return (
        <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${activity.color}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1">{activity.title}</h3>
                <p className="text-sm text-gray-600">{activity.time}</p>
            </div>
        </div>
    );
}
