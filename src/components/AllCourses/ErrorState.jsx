export default function ErrorState({ error }) {
    return (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600 font-semibold mb-2">Error loading courses</p>
            <p className="text-red-500 text-sm">{error}</p>
        </div>
    );
}

