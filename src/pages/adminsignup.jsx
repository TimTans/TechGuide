import { Monitor } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";

const ADMIN_ACCESS_KEY = "admin_access_granted";

function AdminSignUpPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userRole, setUserRole] = useState("Student");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [countdown, setCountdown] = useState(null);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const { session, signUpNewUserAsAdmin } = UserAuth();
    const navigate = useNavigate();

    // Check authorization on mount
    useEffect(() => {
        const adminAccess = sessionStorage.getItem(ADMIN_ACCESS_KEY);
        if (adminAccess === "true") {
            setIsAuthorized(true);
        } else {
            // Redirect to signup page if not authorized
            navigate("/signup", { replace: true });
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccessMessage("");

        const result = await signUpNewUserAsAdmin(email, password, firstName, lastName, userRole);

        if (result.success) {
            setSuccessMessage(`Account created successfully as ${userRole}! Email verification has been bypassed - the user can sign in immediately.`);

            // Clear form
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setUserRole("Student");

            // Start countdown
            let timeLeft = 5;
            setCountdown(timeLeft);

            const interval = setInterval(() => {
                timeLeft--;
                setCountdown(timeLeft);

                if (timeLeft === 0) {
                    clearInterval(interval);
                    setCountdown(null);
                }
            }, 1000);
        } else {
            setError(result.error?.message || "Failed to create account. Please try again.");
        }

        setLoading(false);
    };

    // Redirect if already logged in or not authorized
    if (session) {
        return <Navigate to="/dashboard" replace />;
    }

    if (!isAuthorized) {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="min-h-screen bg-linear-to-b from-orange-50 via-orange-100 to-rose-100 flex flex-col">
            <header className="max-w-7xl mx-auto px-6 lg:px-8 py-5 w-full">
                <Link to="/" className="flex items-center gap-2 w-fit">
                    <Monitor className="w-8 h-8 text-gray-900" />
                    <span className="text-xl font-bold text-gray-900">TECHGUIDE</span>
                </Link>
            </header>

            <div className="flex-1 flex items-center justify-center px-6">
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-lg w-full">
                    <div className="mb-4 pb-4 border-b border-gray-200">
                        <h1 className="text-4xl font-black text-gray-900 mb-2">
                            Admin Sign Up
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Create accounts for members or instructors
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                <p>{error}</p>
                                {error.includes('already registered') && (
                                    <p className="text-sm mt-2">
                                        <Link to="/signin" className="font-semibold underline hover:text-red-800">
                                            Click here to sign in
                                        </Link>
                                    </p>
                                )}
                            </div>
                        )}

                        {successMessage && (
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                                <p className="font-semibold mb-2">{successMessage}</p>
                                <p className="text-sm">The user can now sign in immediately without email verification.</p>
                                {countdown !== null && countdown > 0 && (
                                    <p className="text-sm mt-2 font-semibold text-green-800">
                                        Form will reset in {countdown} second{countdown !== 1 ? 's' : ''}...
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="flex flex-row gap-4 justify-between">
                            <div>
                                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full flex h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Enter first name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full flex h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Enter last name"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full flex h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Enter email address"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full flex h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Create a password (min 6 characters)"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="userRole" className="block text-sm font-semibold text-gray-700 mb-2">
                                User Role
                            </label>
                            <select
                                id="userRole"
                                value={userRole}
                                onChange={(e) => setUserRole(e.target.value)}
                                required
                                className="w-full flex h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="Student">Student</option>
                                <option value="Instructor">Instructor</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-500 text-white px-8 py-6 rounded-full text-lg font-semibold hover:bg-emerald-600 transition-colors shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <button
                            onClick={() => {
                                sessionStorage.removeItem(ADMIN_ACCESS_KEY);
                                navigate("/signup");
                            }}
                            className="w-full py-2 px-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm"
                        >
                            Exit Admin Mode
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminSignUpPage;
