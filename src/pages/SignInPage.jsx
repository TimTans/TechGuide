import { Monitor } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const SignInPage = () => {

    const [isLogin, setIsLogin] = useState(true);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    };



    return (
        <div className="min-h-screen bg-linear-to-b from-orange-50 via-orange-100 to-rose-100 flex flex-col">
            <header className="max-w-7xl mx-auto px-6 lg:px-8 py-5 w-full">
                <Link to="/" className="flex items-center gap-2 w-fit">
                    <Monitor className="w-8 h-8 text-gray-900" />
                    <span className="text-xl font-bold text-gray-900">TECHGUIDE</span>
                </Link>
            </header>

            <div className="flex-1 flex items-center justify-center px-6">
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full">
                    <h1 className="text-4xl font-black text-gray-900 mb-2">
                        {"Welcome Back"}
                    </h1>
                    <p className="text-gray-600 mb-8">
                        {"Sign in to continue learning"}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                                placeholder={"Enter your password"}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-500 text-white px-8 py-6 rounded-full text-lg font-semibold hover:bg-emerald-600 transition-colors shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Please wait..." : "Sign In"}
                        </button>
                    </form>

                    <p className="text-center text-gray-600 text-sm mt-6">
                        {"Don't have an account? "}
                        <Link to="/signup">
                            <text className="text-emerald-600 font-semibold hover:text-emerald-700">Sign Up</text>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignInPage;