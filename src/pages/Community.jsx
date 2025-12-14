import { Users, MessageCircle, Video, Mail, Star, Clock, ShieldCheck, Home } from "lucide-react";
import { Link } from "react-router-dom";
import DashboardNavbar from "../components/Navbar";

export default function Community() {
  const volunteers = [
    {
      id: 1,
      name: "Maria L.",
      role: "Patient Volunteer",
      bio: "Helps with email, video calls, and basic phone setup.",
      rating: 4.9,
      availability: "Weekdays",
    },
    {
      id: 2,
      name: "James K.",
      role: "Tech Expert",
      bio: "Former IT support. Great with scams, passwords, and devices.",
      rating: 4.8,
      availability: "Evenings",
    },
    {
      id: 3,
      name: "Aisha R.",
      role: "Patient Volunteer",
      bio: "Friendly step-by-step help for beginners.",
      rating: 5.0,
      availability: "Weekends",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 via-orange-50 to-white">
      <DashboardNavbar />

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header / Breadcrumb */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/"
            className="text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1"
          >
            <Home className="w-4 h-4" /> Home
          </Link>
          <span className="text-gray-400">/</span>
          <h1 className="text-sm font-semibold text-blue-700">Community</h1>
        </div>

        {/* Page Intro */}
        <div className="mb-12">
          <h1 className="text-5xl font-black text-gray-900 mb-4">Community Support</h1>
          <p className="text-lg text-gray-700 max-w-3xl leading-relaxed">
            Connect with patient volunteers and tech experts who provide one-on-one guidance, answer your questions, and help you gain confidence at your own pace.
          </p>
        </div>

        {/* How it Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <Users className="w-8 h-8 text-blue-600 mb-3" />
            <h3 className="font-bold text-lg mb-2">Choose a Helper</h3>
            <p className="text-sm text-gray-600">
              Browse volunteers and experts based on your needs.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <MessageCircle className="w-8 h-8 text-emerald-600 mb-3" />
            <h3 className="font-bold text-lg mb-2">Ask Questions</h3>
            <p className="text-sm text-gray-600">
              Chat or message at your own pace with no pressure.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">
            <ShieldCheck className="w-8 h-8 text-purple-600 mb-3" />
            <h3 className="font-bold text-lg mb-2">Safe & Supportive</h3>
            <p className="text-sm text-gray-600">
              All helpers are verified and trained to be patient.
            </p>
          </div>
        </div>

        {/* Volunteers */}
        <h2 className="text-3xl font-black text-gray-900 mb-6">
          Available Helpers
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {volunteers.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-3xl shadow-sm p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{v.name}</h3>
                  <p className="text-sm text-gray-500">{v.role}</p>
                </div>

                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-sm font-semibold text-gray-700">
                    {v.rating}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                {v.bio}
              </p>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                <Clock className="w-4 h-4" />
                {v.availability}
              </div>

              <div className="space-y-2">
                <button className="w-full flex items-center justify-center gap-2 py-2 rounded-full bg-blue-500 text-white font-semibold hover:bg-blue-600">
                  <MessageCircle className="w-4 h-4" />
                  Message
                </button>

                <button className="w-full flex items-center justify-center gap-2 py-2 rounded-full bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200">
                  <Video className="w-4 h-4" />
                  Schedule Call
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-20 bg-emerald-500 rounded-3xl p-10 text-white text-center">
          <h3 className="text-3xl font-black mb-3">
            Not sure where to start?
          </h3>
          <p className="text-emerald-100 mb-6">
            Send us a message and we’ll match you with the right helper.
          </p>
          <button className="inline-flex items-center gap-2 bg-white text-emerald-600 px-8 py-3 rounded-full font-bold hover:bg-emerald-50">
            <Mail className="w-5 h-5" />
            Get Matched
          </button>
        </div>
      </main>
    </div>
  );
}
