import { Monitor, Phone, Heart, Target, Users, Award, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function About() {
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50 to-rose-50">
      {/* Header - Matching Homepage */}
      <header>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Monitor className="w-8 h-8 text-gray-900" />
            <span className="text-xl font-bold text-gray-900">TECHGUIDE</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            <a href="/#tutorials" className="text-sm font-semibold text-gray-700 hover:text-gray-900">TUTORIALS</a>
            <a href="/#safety" className="text-sm font-semibold text-gray-700 hover:text-gray-900">SAFETY</a>
            <a href="/#support" className="text-sm font-semibold text-gray-700 hover:text-gray-900">SUPPORT</a>
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
                className={`flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-500 ease-out ${showPhoneNumber
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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight mb-8">
            Bridging The Digital Divide
            <br />
            One Senior At A Time
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We believe technology should empower everyone, regardless of age. That's why we're dedicated to helping seniors navigate the digital world with confidence and safety.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mission */}
            <div className="bg-gradient-to-b from-blue-50 to-blue-100 rounded-3xl p-8">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                To eliminate technology barriers for seniors, ensuring they can connect with loved ones, access information, and stay independent and safe in an increasingly digital world.
              </p>
            </div>

            {/* Heart */}
            <div className="bg-gradient-to-b from-rose-50 to-rose-100 rounded-3xl p-8">
              <div className="w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Approach</h3>
              <p className="text-gray-700 leading-relaxed">
                Patient, jargon-free teaching that meets seniors where they are. We believe learning technology should be empowering, not overwhelming.
              </p>
            </div>

            {/* Community */}
            <div className="bg-gradient-to-b from-emerald-50 to-emerald-100 rounded-3xl p-8">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Community</h3>
              <p className="text-gray-700 leading-relaxed">
                A growing network of instructors, tech experts, and seniors helping each other navigate technology with kindness and understanding.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">Our Story</h2>
          </div>
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-lg">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              TechGuide was founded when we noticed our own parents and grandparents struggling to keep up with rapidly changing technology. They wanted to video call their grandchildren, shop online safely, and stay connected with friends—but felt overwhelmed and afraid of making mistakes.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              We realized that while there were countless tech tutorials online, very few were designed with seniors in mind. Most assumed prior knowledge, used confusing jargon, and moved too quickly.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              So we created TechGuide—a safe, supportive space where seniors can learn at their own pace, ask questions without judgment, and gain the confidence to embrace technology on their own terms.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Making A Difference</h2>
            <p className="text-xl text-gray-300">No Senior Left Behind</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-black text-emerald-400 mb-2">500+</div>
              <div className="text-gray-300 font-semibold">Seniors Helped</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-emerald-400 mb-2">20+</div>
              <div className="text-gray-300 font-semibold">Instructors</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-emerald-400 mb-2">1,000+</div>
              <div className="text-gray-300 font-semibold">Hours Of Support</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-emerald-400 mb-2">98%</div>
              <div className="text-gray-300 font-semibold">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-6">
            Ready To Start Your Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join hundreds of seniors who've discovered the joy and independence that comes with digital confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/signup">
              <button className="bg-emerald-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-emerald-600 transition-colors shadow-lg">
                START LEARNING
              </button>
            </Link>

            <Link to="/">
              <button className="bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-50 transition-colors border-2 border-gray-200 flex items-center gap-2">
                BACK TO HOME
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>

          </div>
        </div>
      </section>
    </div>
  );
}