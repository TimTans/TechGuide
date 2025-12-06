export default function EmptyState({ 
    message, 
    showClearButton = false, 
    onClear 
}) {
    return (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <p className="text-gray-600 text-lg mb-2">{message}</p>
            {showClearButton && (
                <button
                    onClick={onClear}
                    className="text-gray-900 font-semibold hover:underline"
                >
                    Clear {message.includes('filters') ? 'filters' : 'search'}
                </button>
            )}
        </div>
    );
}

