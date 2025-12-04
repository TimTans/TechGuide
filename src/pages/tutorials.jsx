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
              href="https://www.youtube.com/watch?v=RnM3u99xIf4&list=PL7096007028FAA3F6&index=7"
              target="_blank"
              className="min-w-[260px] bg-white rounded-xl shadow-md hover:shadow-lg transition p-5"
            >
              <img
                src="data:image/png;base64,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"
                alt="Intro to Computers"
                className="rounded-lg mb-3"
              />
              <h3 className="font-semibold text-gray-800">Computer Basics: Setting Up a Desktop Computer</h3>
              <p className="text-gray-600 text-sm">Perfect for learning how to set up an area in your home just for your computer</p>
            </a>

            {/* Video 2*/}
              <a
                href="https://www.youtube.com/watch?v=7rcG8iapnhk"
                target="_blank"
                className="min-w-[260px] bg-white rounded-xl shadow-md hover:shadow-lg transition p-5"
              >
                <img
                  src="data:image/png;base64,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"
                  alt="Create Gmail Account"
                  className="rounded-lg mb-3"
                />
                <h3 className="font-semibold text-gray-800">Create a Gmail Account</h3>
                <p className="text-gray-600 text-sm">Learn how to create a gmail account so you can email your family and friends</p>
              </a>
            {/* Video 3 - Send an Email */}
            <a
              href="https://www.youtube.com/watch?v=_FNJm4xzZCw"
              target="_blank"
              className="min-w-[260px] bg-white rounded-xl shadow-md hover:shadow-lg transition p-5"
            >
              <img
                src="https://i.ytimg.com/vi/6j9vnc_KvHE/maxresdefault.jpg"
                alt="Send an Email"
                className="rounded-lg mb-3"
              />
              <h3 className="font-semibold text-gray-800">How to Send an Email through Gmail</h3>
              <p className="text-gray-600 text-sm">Learn how to stay in touch with your familty and friends through the internet</p>
            </a>

            {/* Video 4 - Protecting Your Computer */}
            <a
              href="https://www.youtube.com/watch?v=6mMZFoXbKqI&list=PL7096007028FAA3F6&index=11"
              target="_blank"
              className="min-w-[260px] bg-white rounded-xl shadow-md hover:shadow-lg transition p-5"
            >
              <img
                src="https://i.ytimg.com/vi/6mMZFoXbKqI/maxresdefault.jpg"
                alt="Protecting Your Computer"
                className="rounded-lg mb-3"
              />
              <h3 className="font-semibold text-gray-800">Protect Your Computer</h3>
              <p className="text-gray-600 text-sm">Learn how to keep your computer safe from hackers and viruses</p>
            </a>

            {/* Video 5 - Spam and Phishing Emails */}
            <a
              href="https://www.youtube.com/watch?v=NI37JI7KnSc&list=PL7096007028FAA3F6&index=16"
              target="_blank"
              className="min-w-[260px] bg-white rounded-xl shadow-md hover:shadow-lg transition p-5"
            >
              <img
                src="data:image/png;base64,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"
                alt="Protecting Your Computer"
                className="rounded-lg mb-3"
              />
              <h3 className="font-semibold text-gray-800">How to spot Dangerous emails</h3>
              <p className="text-gray-600 text-sm">Learn how to stay safe online by spotting phishing and spam emails</p>
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
