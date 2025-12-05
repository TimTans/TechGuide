export default function LoadingSkeleton() {
    return (
        <div className="bg-white rounded-3xl p-6 shadow-sm animate-pulse flex flex-col">
            <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gray-200"></div>
                <div className="w-20 h-6 rounded-full bg-gray-200"></div>
            </div>
            {/* Title skeleton */}
            <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
            {/* Category skeleton */}
            <div className="h-4 bg-gray-200 rounded mb-3 w-24"></div>
            {/* Description skeleton - multiple lines */}
            <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
            <div className="mt-auto">
                <div className="flex justify-between mb-4">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-12 bg-gray-200 rounded-full"></div>
            </div>
        </div>
    );
}

