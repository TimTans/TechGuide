import { AlertTriangle, Monitor, PhoneOff, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function FakeTechSupportPopups() {
  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 via-orange-50 to-white">
      <main className="max-w-4xl mx-auto px-6 lg:px-8 py-12 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/" className="text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1">
            <Home className="w-4 h-4" /> Home
          </Link>
          <span className="text-gray-400">/</span>
          <Link to="/safety" className="text-sm font-semibold text-gray-500 hover:text-gray-900">
            Safety Alert Center
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-sm font-semibold text-emerald-700">Fake Tech Support Pop-ups</span>
        </div>

        <div className="flex items-center gap-4 mt-8 mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
          <h1 className="text-4xl font-black text-gray-900">
            Fake Tech Support Pop-ups
          </h1>
        </div>

        <p className="text-gray-500 mb-8">Published: 3 Days Ago</p>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <p className="text-lg text-gray-700">
            Scam pop-ups may claim your computer is “infected” and tell you to call a number
            immediately. They’re designed to scare you into giving access or paying money.
          </p>

          <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 p-4 rounded-xl">
            <Monitor className="w-5 h-5 text-orange-700" />
            <p className="text-sm font-semibold text-orange-800">
              Real companies don’t use random browser pop-ups to demand urgent action.
            </p>
          </div>

          <h2 className="text-xl font-bold text-gray-900">What to do</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Do <strong>not</strong> call the number shown in the pop-up</li>
            <li>Do <strong>not</strong> click “Allow”, “Scan”, or “Download”</li>
            <li>Close the tab (or force quit the browser if it won’t close)</li>
            <li>Run your trusted antivirus / Windows Security scan</li>
            <li>If you gave remote access, disconnect from Wi-Fi and get help immediately</li>
          </ul>

          <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-4 rounded-xl">
            <PhoneOff className="w-5 h-5 text-red-600" />
            <p className="text-sm font-semibold text-red-700">
              Never give remote access to anyone who contacted you unexpectedly.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
