import { AlertTriangle, Mail, Link as LinkIcon, ShieldCheck, Home } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmailPasswordResetScams() {
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
          <span className="text-sm font-semibold text-emerald-700">Email Password Reset Scams</span>
        </div>

        <div className="flex items-center gap-4 mt-8 mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
          <h1 className="text-4xl font-black text-gray-900">
            Email Password Reset Scams
          </h1>
        </div>

        <p className="text-gray-500 mb-8">Published: Last Week</p>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <p className="text-lg text-gray-700">
            Scammers send fake “password reset” emails to trick you into clicking a link
            and entering your login details on a fake website.
          </p>

          <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 p-4 rounded-xl">
            <Mail className="w-5 h-5 text-orange-700" />
            <p className="text-sm font-semibold text-orange-800">
              If you didn’t request a reset, treat the email as suspicious.
            </p>
          </div>

          <h2 className="text-xl font-bold text-gray-900">How to spot it</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Sender address is slightly “off” (extra letters, weird domain)</li>
            <li>Urgent language: “Account locked”, “Verify now”</li>
            <li>Link goes to a strange URL (hover to preview)</li>
            <li>Spelling/grammar mistakes or unusual formatting</li>
          </ul>

          <div className="flex items-center gap-3 bg-red-50 border border-red-200 p-4 rounded-xl">
            <LinkIcon className="w-5 h-5 text-red-600" />
            <p className="text-sm font-semibold text-red-700">
              Never sign in from an email link if you’re unsure. Go to the website/app directly.
            </p>
          </div>

          <h2 className="text-xl font-bold text-gray-900">What to do instead</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Open a new tab and type the website yourself</li>
            <li>Check your account security settings</li>
            <li>Enable two-factor authentication (2FA) if available</li>
            <li>Report the email as phishing in your email provider</li>
          </ul>

          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <p className="text-sm font-semibold text-emerald-800">
              Tip: Use a password manager to avoid typing passwords into fake sites.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
