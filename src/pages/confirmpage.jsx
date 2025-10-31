import { Monitor, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const ConfirmPage = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        // Start countdown
        const countdownInterval = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);

        // Redirect after 3 seconds
        const redirectTimer = setTimeout(() => {
            navigate("/signin");
        }, 5000);

        // Cleanup timers
        return () => {
            clearInterval(countdownInterval);
            clearTimeout(redirectTimer);
        };
    }, [navigate]);

    return (
        <div className="min-h-screen bg-linear-to-b from-emerald-50 via-emerald-100 to-teal-100 flex flex-col">
            <header className="max-w-7xl mx-auto px-6 lg:px-8 py-5 w-full">
                <Link to="/" className="flex items-center gap-2 w-fit">
                    <Monitor className="w-8 h-8 text-gray-900" />
                    <span className="text-xl font-bold text-gray-900">TECHGUIDE</span>
                </Link>
            </header>

            <div className="flex-1 flex items-center justify-center px-6">
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
                    <div className="flex justify-center mb-6">
                        <CheckCircle className="w-20 h-20 text-emerald-500" />
                    </div>

                    <h1 className="text-4xl font-black text-gray-900 mb-4">
                        Email Verified!
                    </h1>

                    <p className="text-gray-600 mb-6 text-lg">
                        Your email has been successfully verified. You can now sign in to your account.
                    </p>

                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-6">
                        <p className="font-semibold">
                            Redirecting to sign in in {countdown} second{countdown !== 1 ? 's' : ''}...
                        </p>
                    </div>

                    <Link
                        to="/signin"
                        className="inline-block w-full bg-emerald-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-600 transition-colors shadow-lg"
                    >
                        Sign In Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ConfirmPage;

