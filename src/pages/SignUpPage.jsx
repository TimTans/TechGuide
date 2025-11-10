import { Monitor } from "lucide-react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserAuth } from "../context/AuthContext";

function SignUpPage() {

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userRole, setUserRole] = useState("")
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [countdown, setCountdown] = useState(5);
    const { session, signUpNewUser } = UserAuth();
    const navigate = useNavigate();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccessMessage("");
        
        const result = await signUpNewUser(email, password, firstName, lastName);

        if (result.success) {
            setSuccessMessage("Account created successfully! Please check your email to verify your account before signing in.");

            // Clear form
            setFirstName("");
            setLastName("");
            setEmail("");
            setPassword("");
            setUserRole("")

            // Start countdown and redirect after 10 seconds
            let timeLeft = 10;
            setCountdown(timeLeft);

            const interval = setInterval(() => {
                timeLeft--;
                setCountdown(timeLeft);

                if (timeLeft === 0) {
                    clearInterval(interval);
                    navigate("/signin");
                }
            }, 1000);
        } else {
            setError(result.error?.message || "Failed to create account. Please try again.");
        }

        setLoading(false);
    };

    // Redirect if already logged in
    if (session) {
        return <Navigate to="/dashboard" replace />;
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
                    <h1 className="text-4xl font-black text-gray-900 mb-2">
                        {"Get Started"}
                    </h1>
                    <p className="text-gray-600 mb-8">
                        {"Join TechGuide today"}
                    </p>

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
                                <p className="text-sm">We've sent a confirmation link to your email address. Please click the link to verify your account.</p>
                                <p className="text-sm mt-1 text-green-600">Don't forget to check your spam folder if you don't see it!</p>
                                {countdown !== null && (
                                    <p className="text-sm mt-2 font-semibold text-green-800">
                                        Redirecting to sign in in {countdown} second{countdown !== 1 ? 's' : ''}...
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
                                    placeholder="Enter your first name"
                                />
                            </div>
                            <div>
                                <label htmlFor="Last Name" className="block text-sm font-semibold text-gray-700 mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full flex h-10 rounded-md border border-gray-300 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Enter your last name"
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
                                placeholder="Enter your email"
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
                                placeholder={"Create a password (min 6 characters)"}
                                required
                            />
                        </div>

                        <div className = "ml-auto">
                            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                                Register as?
                            </label>
                            <select value={userRole} onChange={(e)=>setUserRole(e.target.value)} required className="block w-60 p-2 border border-gray-300 rounded-lg bg-white text-gray-800 focus:ring-blue-500 focus:border-blue-500" >
                                <option value="">-- choose an option --</option>
                                <option value="Student">Student</option>
                                <option value="Instructor">Instructor</option>
                            </select>
                        </div>
                        

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-500 text-white px-8 py-6 rounded-full text-lg font-semibold hover:bg-emerald-600 transition-colors shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Please wait..." : "Create Account"}
                        </button>
                    </form>

                    <p className="text-center text-gray-600 text-sm mt-6">
                        {"Already have an account? "}
                        <Link to="/signin" className="text-emerald-600 font-semibold hover:text-emerald-700">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}


export default SignUpPage;