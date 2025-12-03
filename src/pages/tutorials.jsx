import { Link } from "react-router-dom";
import { useState } from "react";
import { Monitor, Phone } from "lucide-react";

export default function About() {
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);

  return (
    <div className="min-h-screen bg-linear-to-b from-white via-orange-50 to-rose-50">
      
      {/* Header */}
      <header>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Monitor className="w-8 h-8 text-gray-900" />
            <span className="text-xl font-bold text-gray-900">TECHGUIDE</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <Link to="/tutorials" className="text-sm font-semibold text-gray-700 hover:text-gray-900">TUTORIALS</Link>
            <Link to="/safety" className="text-sm font-semibold text-gray-700 hover:text-gray-900">SAFETY</Link>
            <a href="/#support" className="text-sm font-semibold text-gray-700 hover:text-gray-900">SUPPORT</a>
            <Link to="/about" className="text-sm font-semibold text-gray-700 hover:text-gray-900">ABOUT</Link>
          </nav>

          <div className={`flex items-center transition-all duration-300 ${showPhoneNumber ? "gap-2" : "gap-0"}`}>
            <div className="hidden md:flex items-center overflow-hidden">
              <button
                onClick={() => setShowPhoneNumber(!showPhoneNumber)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  showPhoneNumber
                    ? "bg-emerald-100 text-emerald-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                }`}
              >
                <Phone className="w-5 h-5" />
              </button>

              <div
                className={`flex items-center gap-2 bg-linear-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-500 ease-out ${
                  showPhoneNumber ? "max-w-xs opacity-100 ml-1" : "max-w-0 opacity-0 ml-0"
                }`}
              >
                <span className="text-sm font-bold whitespace-nowrap">(123) 456-7890</span>
              </div>
            </div>

            <Link
              to="/signup"
              className={`bg-gray-900 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-gray-800 transition-all duration-300 ${
                showPhoneNumber ? "ml-0" : "-ml-2"
              }`}
            >
              GET STARTED
            </Link>
          </div>
        </div>
      </header>

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="max-w-5xl mx-auto px-6 py-16">

        <h1 className="text-4xl font-bold text-gray-900 mb-6">Learn with TechGuide</h1>
        <p className="text-gray-700 text-lg leading-relaxed mb-10">
          TechGuide is a platform designed to help beginners learn technology in a clear,
          supportive, and accessible way.
        </p>

        {/* Topic Bubble */}
        <div className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-full shadow-md mb-6">
          <span className="text-sm font-semibold">
            📘 These videos will help you learn basic digital skills
          </span>
        </div>

        {/* Scrollable Video Section */}
        <div className="overflow-x-auto pb-4">
          <div className="flex gap-6">
            
            {/* Video 1 */}
            <a
              href="https://www.youtube.com/"
              target="_blank"
              className="min-w-[260px] bg-white rounded-xl shadow-md hover:shadow-lg transition p-5"
            >
              <img
                src="https://i.ytimg.com/vi/JcXQk6Tc5cY/maxresdefault.jpg"
                alt="Intro to Computers"
                className="rounded-lg mb-3"
              />
              <h3 className="font-semibold text-gray-800">Computer Basics</h3>
              <p className="text-gray-600 text-sm">Perfect for beginners</p>
            </a>

            {/* Video 2 */}
            <a
              href="https://www.youtube.com/"
              target="_blank"
              className="min-w-[260px] bg-white rounded-xl shadow-md hover:shadow-lg transition p-5"
            >
              <img
                src="https://i.ytimg.com/vi/knK8gZjJZzk/maxresdefault.jpg"
                alt="Email Basics"
                className="rounded-lg mb-3"
              />
              <h3 className="font-semibold text-gray-800">How to Use Email</h3>
              <p className="text-gray-600 text-sm">Learn sending & receiving</p>
            </a>

            {/* Video 3 */}
            <a
              href="https://www.youtube.com/"
              target="_blank"
              className="min-w-[260px] bg-white rounded-xl shadow-md hover:shadow-lg transition p-5"
            >
              <img
                src="https://i.ytimg.com/vi/0Q9mG9hEKaY/maxresdefault.jpg"
                alt="Internet Safety"
                className="rounded-lg mb-3"
              />
              <h3 className="font-semibold text-gray-800">Internet Safety</h3>
              <p className="text-gray-600 text-sm">Stay safe online</p>
            </a>

          </div>
        </div>
      </main>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="py-10 text-center text-gray-600">
        © {new Date().getFullYear()} TechGuide. All rights reserved.
      </footer>

    </div>
  );
}
