import { Monitor, Phone, ArrowRight, Smartphone, Lock, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { UserAuth } from "../context/AuthContext";



export default function HomePage() {
    const [showPhoneNumber, setShowPhoneNumber] = useState(false);

    const { session, signUpNewUser, signOut, signIn } = UserAuth();

    return (
        <div>
            <div className="min-h-80 min-w-screen bg-linear-to-b from-white100 via-orange-100 to-rose-100">

                <header>
                    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Monitor className="w-8 h-8 text-gray-900" />
                            <span className="text-xl font-bold text-gray-900">TECHGUIDE</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                            <Link to="/tutorials" className="text-sm font-semibold text-gray-700 hover:text-gray-900">TUTORIALS</Link>
                            <Link to="/safety" className="text-sm font-semibold text-gray-700 hover:text-gray-900">SAFETY</Link>
                            <Link to="/support" className="text-sm font-semibold text-gray-700 hover:text-gray-900">SUPPORT</Link>
                            <Link to="/about" className="text-sm font-semibold text-gray-700 hover:text-gray-900">ABOUT</Link>
                        </nav>
                        <div className={`flex items-center transition-all duration-300 ${showPhoneNumber ? 'gap-2' : 'gap-0'}`}>
                            <div className="hidden md:flex items-center overflow-hidden">
                                <button
                                    onClick={() => setShowPhoneNumber(!showPhoneNumber)}
                                    className={`p-2 rounded-full transition-all duration-300 ${showPhoneNumber
                                        ? 'bg-emerald-100 text-emerald-600'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900'
                                        }`}
                                >
                                    <Phone className="w-5 h-5" />
                                </button>
                                <div
                                    className={`flex items-center gap-2 bg-linear-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-500 ease-out ${showPhoneNumber
                                        ? 'max-w-xs opacity-100 ml-1'
                                        : 'max-w-0 opacity-0 ml-0'
                                        }`}
                                >
                                    <span className="text-sm font-bold whitespace-nowrap">(123) 456-7890</span>
                                </div>
                            </div>
                            <Link to="/signup" className={`bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all duration-300 ${showPhoneNumber ? 'ml-0' : '-ml-2'}`}>
                                GET STARTED
                            </Link>
                        </div>
                    </div>
                </header>

                <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-64 pb-64 bg-">
                    <div className="text-center">
                        <div className="flex justify-center items-center mb-8">
                            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-gray-900 leading-none">
                                Tech
                            </h1>
                            <div className="mx-4 md:mx-6 w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-full overflow-hidden border-8 border-white shadow-2xl">
                                <img
                                    src="./src/assets/elderly1.jpg"
                                    alt="Senior learning technology"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black text-gray-900 leading-none">
                                Guide
                            </h1>
                        </div>
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-8">
                            is Confidence
                        </h2>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
                            <Link to="/signup">
                                <button className="bg-emerald-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-600 transition-colors shadow-lg">
                                    START LEARNING
                                </button>
                            </Link>

                            <Link to="/signin">
                                <button className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-gray-200 flex items-center gap-2">
                                    I NEED HELP
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>
                        </div>
                    </div>
                </section >
            </div >

            {/* What We Do Section */}
            < section className="py-16 bg-gray-50" >
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-800 rounded-full text-sm font-bold mb-6">
                            What We Do
                        </span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
                            Empowering Seniors To Navigate
                            <br />
                            The Digital World Safely
                        </h2>

                        <Link to="/about">
                            <button className="mt-8 inline-flex items-center gap-2 text-gray-900 font-semibold hover:gap-3 transition-all">
                            LEARN MORE
                            <ArrowRight className="w-5 h-5" />
                            </button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                        {/* Card 1*/}
                        <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:bg-linear-to-b hover:from-orange-50 hover:to-orange-100 transition-all">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                <Smartphone className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Learn Technology
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                Master email, video calls, social media, and online shopping with clear, step-by-step tutorials designed for seniors—no tech jargon, just easy learning.
                            </p>
                            <div className="flex gap-2 mb-6">
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold"># Email Basics</span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold"># Video Calls</span>
                            </div>
                            <Link to="/tutorials" className="flex items-center gap-2 text-gray-900 font-semibold hover:gap-3 transition-all">
                                View Tutorials
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        {/* Card 2*/}
                        <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:bg-linear-to-b hover:from-orange-50 hover:to-orange-100 transition-all">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-6">
                                <Lock className="w-6 h-6 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Stay Safe Online
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                Learn to spot scams, protect your personal information, and navigate the internet securely with real-time alerts and interactive fraud detection lessons.
                            </p>
                            <div className="flex gap-2 mb-6">
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold"># Scam Detection</span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold"># Privacy</span>
                            </div>
                            <Link to="/safety" className="flex items-center gap-2 text-gray-900 font-semibold hover:gap-3 transition-all">
                                Safety Resources
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        {/* Card 3*/}
                        <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl hover:bg-linear-to-b hover:from-orange-50 hover:to-orange-100 transition-all">
                            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                                <Users className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                Get Personal Support
                            </h3>
                            <p className="text-gray-600 leading-relaxed mb-8">
                                Connect with patient volunteers and tech experts who provide one-on-one guidance, answer your questions, and help you gain confidence at your own pace.
                            </p>
                            <div className="flex gap-2 mb-6">
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 bg-emerald-200 rounded-full border-2 border-white"></div>
                                    <div className="w-8 h-8 bg-blue-200 rounded-full border-2 border-white"></div>
                                    <div className="w-8 h-8 bg-orange-200 rounded-full border-2 border-white"></div>
                                </div>
                                <span className="text-sm font-semibold text-gray-700">Join Our Community</span>
                            </div>
                            <button className="flex items-center gap-2 text-gray-900 font-semibold hover:gap-3 transition-all">
                                 Get Help Now 
                                 <ArrowRight className="w-5 h-5" /> 
                                 </button>
                        </div>
                    </div>
                </div>
            </section >
        </div >
    )
}