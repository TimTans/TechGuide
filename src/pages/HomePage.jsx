import { Monitor } from "lucide-react";

export default function HomePage() {
    return (
        <div className="min-h-screen bg-linear-to-b from-amber-50 via-orange-50 to-rose-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Monitor className="w-6 h-6 text-gray-900" />
                        <span className="text-xl font-bold text-gray-900">TechGuide</span>
                    </div>
                    <nav className="flex items-center gap-8">
                        <a href="#tutorials" className="text-sm font-semibold text-gray-700 hover:text-gray-900">TUTORIALS</a>
                        <a href="#safety" className="text-sm font-semibold text-gray-700 hover:text-gray-900">SAFETY</a>
                        <a href="#support" className="text-sm font-semibold text-gray-700 hover:text-gray-900">SUPPORT</a>
                        <a href="#about" className="text-sm font-semibold text-gray-700 hover:text-gray-900">ABOUT</a>
                    </nav>
                </div>
            </header>
        </div>
    )
}