import { useState, useEffect } from "react";
import { X, Lock, AlertCircle } from "lucide-react";

const ADMIN_PASSWORD = "Test";
const ADMIN_ACCESS_KEY = "admin_access_granted";

export default function AdminPasswordModal({ isOpen, onClose, onSuccess }) {
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLocked, setIsLocked] = useState(false);
    const [lockoutTime, setLockoutTime] = useState(0);

    useEffect(() => {
        if (isOpen) {
            setPassword("");
            setError("");
            setIsLocked(false);
            setLockoutTime(0);
        }
    }, [isOpen]);

    useEffect(() => {
        if (isLocked && lockoutTime > 0) {
            const timer = setInterval(() => {
                setLockoutTime((prev) => {
                    if (prev <= 1) {
                        setIsLocked(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [isLocked, lockoutTime]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isLocked) {
            return;
        }

        if (password === ADMIN_PASSWORD) {
            setError("");
            // Set sessionStorage to grant admin access
            sessionStorage.setItem(ADMIN_ACCESS_KEY, "true");
            onSuccess();
        } else {
            setError("Incorrect password. Access denied.");
            setIsLocked(true);
            setLockoutTime(15);
            setPassword("");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                onClick={!isLocked ? onClose : undefined}
            ></div>

            {/* Modal */}
            <div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative z-10"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Lock className="w-5 h-5 text-gray-700" />
                        <h2 className="text-xl font-bold text-gray-900">Admin Access</h2>
                    </div>
                    {!isLocked && (
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold">{error}</p>
                                {isLocked && (
                                    <p className="text-xs mt-1">
                                        Please wait {lockoutTime} second{lockoutTime !== 1 ? 's' : ''} before trying again.
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <div>
                        <label htmlFor="adminPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                            Enter Admin Password
                        </label>
                        <input
                            type="password"
                            id="adminPassword"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={isLocked}
                            placeholder="Enter password"
                            className="w-full flex h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100"
                            required
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        {!isLocked && (
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-2 px-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={isLocked || !password}
                            className="flex-1 py-2 px-4 bg-emerald-500 text-white rounded-lg font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLocked ? `Wait ${lockoutTime}s` : "Verify"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

