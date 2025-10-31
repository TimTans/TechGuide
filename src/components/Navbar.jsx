import { Monitor, LogOut, Bell, Settings, User, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
    const navigate = useNavigate();
    const { signOut } = UserAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleSignOut = async () => {
        const result = await signOut();
        if (result.success) {
            navigate("/");
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <header className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                        <Monitor className="w-8 h-8 text-gray-900" />
                        <span className="text-xl font-bold text-gray-900">TECHGUIDE</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <Bell className="w-6 h-6 text-gray-700" />
                            <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white">2</span>
                        </button>

                        {/* User Profile Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-sm font-semibold"
                            >
                                <User className="w-5 h-5 text-gray-700" />
                                <ChevronDown className={`w-4 h-4 text-gray-700 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    <button
                                        onClick={() => {
                                            navigate("/profile");
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <User className="w-5 h-5 text-gray-700" />
                                        <span className="text-sm font-medium text-gray-700">User Profile</span>
                                    </button>

                                    <button
                                        onClick={() => {
                                            navigate("/settings");
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                                    >
                                        <Settings className="w-5 h-5 text-gray-700" />
                                        <span className="text-sm font-medium text-gray-700">Settings</span>
                                    </button>

                                    <div className="border-t border-gray-200 my-2"></div>

                                    <button
                                        onClick={() => {
                                            handleSignOut();
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left"
                                    >
                                        <LogOut className="w-5 h-5 text-red-600" />
                                        <span className="text-sm font-medium text-red-600">Sign Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}