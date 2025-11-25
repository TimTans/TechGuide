import React, { useState } from 'react';
import { Search, Mail, MessageSquare, HelpCircle, ChevronDown, ChevronUp, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import DashboardNavbar from '../components/Navbar';

const faqData = [
  {
    q: "I forgot my password, what should I do?",
    a: "If you can't remember your password, please contact your instructor or support helper. They can help you regain access to your account"
  },
  {
    q: "How do I update my profile information?",
    a: "Navigate to the User Profile page (via the top right menu). You can edit your name, email, and preferences there."
  },
  {
    q: "What browsers are supported?",
    a: "We officially support the latest two versions of Chrome, Firefox, Edge, and Safari."
  },
];

const SupportPage = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleFaqToggle = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Placeholder for sending the contact form data to a backend
    console.log("Support request submitted:", formData);
    // Note: Using a custom modal/message box instead of alert() in a real app
    console.log('Thank you! Your support request has been submitted. We will contact you shortly.'); 
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50 via-orange-50 to-white">
      <DashboardNavbar />
      
      {/* Use the main content container from the Safety component */}
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12 pb-20">
        
        {/* Breadcrumb structure and styling matching other pages */}
        <div className="flex items-center gap-4 mb-8">
            <Link to="/dashboard" className="text-sm font-semibold text-gray-500 hover:text-gray-900 flex items-center gap-1">
                <Home className="w-4 h-4" /> Dashboard
            </Link>
            <span className="text-gray-400">/</span>
            {/* Using green text for the active page to match the support theme */}
            <h1 className="text-sm font-semibold text-green-700">Help Center</h1>
        </div>
        
        {/* Main Content Card container */}
        <div className="bg-white shadow-xl rounded-xl p-6 sm:p-10">
          
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-gray-800 text-left flex items-center">
                <HelpCircle className="w-8 h-8 mr-3 text-green-500" />
                Help Center
            </h1>
            <p className="text-gray-500 mt-2 text-left">Find instant answers or reach out to our team.</p>
          </div>

          {/* Search Bar for Knowledge Base */}
          <div className="mb-10">
            <label htmlFor="search" className="sr-only">Search Support Articles</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                id="search"
                placeholder="Search FAQs or knowledge base..."
                className="block w-full rounded-lg border-2 border-gray-300 py-3 pl-10 pr-4 text-lg focus:border-green-500 focus:ring-green-500 transition duration-150 ease-in-out"
              />
            </div>
          </div>

          {/* FAQ Section */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
              <HelpCircle className="w-6 h-6 mr-2 text-green-500" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqData.map((item, index) => (
                <div key={index} className="border border-gray-200 rounded-lg shadow-sm">
                  <button
                    type="button"
                    className="flex justify-between items-center w-full p-4 text-left font-semibold text-gray-700 hover:bg-gray-50 transition duration-150"
                    onClick={() => handleFaqToggle(index)}
                  >
                    <span>{item.q}</span>
                    {activeFaq === index ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  {activeFaq === index && (
                    <div className="p-4 pt-0 text-gray-600 bg-gray-50/50">
                      <p>{item.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Contact Form Section */}
          <section>
            <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center">
              <MessageSquare className="w-6 h-6 mr-2 text-green-500" />
              Still Need Help? Contact Us
            </h2>
            <form onSubmit={handleContactSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-lg shadow-inner">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2"
                  required
                />
              </div>

              {/* Subject (Full Width) */}
              <div className="md:col-span-2">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2"
                  required
                />
              </div>

              {/* Message (Full Width) */}
              <div className="md:col-span-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleFormChange}
                  className="w-full rounded-lg border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out items-center"
                >
                  <Mail className="w-5 h-5 mr-2" />
                  Send Request
                </button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SupportPage;