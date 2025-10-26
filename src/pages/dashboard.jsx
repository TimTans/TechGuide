import { Monitor, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../App";

export default function Dashboard({ user }) {
    const navigate = useNavigate();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate("/");
    };

    return (
        <div className="min-h-screen bg-linear-to-b from-orange-50 via-orange-100 to-rose-100">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <Monitor className="w-8 h-8 text-gray-900" />
                        <span className="text-xl font-bold text-gray-900">TECHGUIDE</span>
                    </Link>
                    <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
                    <h1 className="text-4xl font-black text-gray-900 mb-4">
                        Welcome to Your Dashboard!
                    </h1>
                    <p className="text-gray-600 mb-6">
                        You're now logged in as: <span className="font-semibold">{user?.email}</span>
                    </p>
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-6 py-4 rounded-lg">
                        <p className="font-semibold mb-2">🎉 Authentication successful!</p>
                        <p>You can now start building your dashboard features.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};