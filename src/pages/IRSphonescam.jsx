import { AlertTriangle, Phone, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function IRSPhoneScam() {
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
          <span className="text-sm font-semibold text-emerald-700">IRS Phone Scam Warning</span>
        </div>

        <div className="flex items-center gap-4 mt-8 mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
          <h1 className="text-4xl font-black text-gray-900">
            IRS Phone Scam Warning
          </h1>
        </div>

        <p className="text-gray-500 mb-8">Published: Today</p>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-5">
          <p className="text-lg text-gray-700">
            The IRS will <span className="font-bold">never</span> call to demand
            immediate payment via gift card, wire transfer, or crypto.
          </p>

          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Hang up immediately</li>
            <li>Do not share personal or financial information</li>
            <li>Do not install remote access software</li>
            <li>Report the scam using official resources</li>
          </ul>

          <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-4 rounded-xl">
            <Phone className="w-5 h-5 text-red-600" />
            <p className="text-sm font-semibold text-red-700">
              Only call official numbers you find on trusted government sites.
            </p>
          </div>
        </div>

      </main>
    </div>
  );
}
