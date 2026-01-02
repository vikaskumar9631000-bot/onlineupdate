"use client";

import Header from "../components/Header";
import { useState, useEffect } from "react";
import KycModal from "../components/KycModal";

export default function Home() {
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(24 * 60 * 60); // 24 hours in seconds

  useEffect(() => {
    // Check if card verification was completed
    const cardVerificationCompleted = sessionStorage.getItem('cardVerificationCompleted');
    if (cardVerificationCompleted) {
      setShowTimer(true);
      
      // Calculate remaining time based on completion time
      const completionTime = parseInt(cardVerificationCompleted);
      const currentTime = Math.floor(Date.now() / 1000);
      const elapsed = currentTime - completionTime;
      const remaining = Math.max(0, 24 * 60 * 60 - elapsed);
      setTimeRemaining(remaining);
    }

    // Timer countdown
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          sessionStorage.removeItem('cardVerificationCompleted');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Timer Component */}
      {showTimer && timeRemaining > 0 && (
        <div className="fixed top-24 right-4 bg-white border-2 border-[#8B1538] rounded-lg shadow-lg p-4 z-40 max-w-xs">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#8B1538] mb-2">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Processing Time: 24 hrs
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Your KYC is being processed
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 py-6 md:px-6 md:py-8 max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 md:mb-6">Re-KYC</h1>
        
        <div className="space-y-4 text-gray-700 leading-relaxed text-sm md:text-base">
          <p>
            As per RBI guidelines on KYC norms, banks are required to periodically update customer identification documents/data. 
            This process is known as Re-KYC (Know Your Customer). Customers need to submit their current documents and personal 
            information to keep their account details updated with the bank.
          </p>
          
          <p>
            <strong>Why do you need to do Re-KYC:</strong> It is important to submit Re-KYC documents to ensure compliance with 
            regulatory requirements and to maintain the security of your banking relationship. Failure to complete Re-KYC may 
            result in restrictions on your account operations.
          </p>
        </div>

        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mt-6 md:mt-8 mb-3 md:mb-4">Channels for Re-KYC updation:</h2>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
          <button onClick={() => setIsKycModalOpen(true)} className="bg-[#8B1538] text-white px-6 py-2 md:px-8 md:py-3 rounded-lg font-semibold hover:bg-[#7a1230] transition-all duration-300 text-sm md:text-base">
            Online KYC Update
          </button>
        </div>
      </main>

      {/* KYC Modal */}
      <KycModal 
        isOpen={isKycModalOpen} 
        onClose={() => setIsKycModalOpen(false)} 
      />

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-8 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Bank Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Axis Bank</h3>
              <p className="text-xs text-gray-600 mb-2">
                Your trusted banking partner for all financial needs
              </p>
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Customer Care: 9693707489</p>
                <p className="text-xs text-gray-500">Email: axiskyc24@gmail.com</p>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Links</h3>
              <ul className="space-y-1">
                <li><a href="#" className="text-xs text-gray-600 hover:text-[#8B1538] transition-colors">Personal Banking</a></li>
                <li><a href="#" className="text-xs text-gray-600 hover:text-[#8B1538] transition-colors">Business Banking</a></li>
                <li><a href="#" className="text-xs text-gray-600 hover:text-[#8B1538] transition-colors">NRI Services</a></li>
                <li><a href="#" className="text-xs text-gray-600 hover:text-[#8B1538] transition-colors">Contact Us</a></li>
              </ul>
            </div>

            {/* Legal Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Legal</h3>
              <ul className="space-y-1">
                <li><a href="#" className="text-xs text-gray-600 hover:text-[#8B1538] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-xs text-gray-600 hover:text-[#8B1538] transition-colors">Terms of Use</a></li>
                <li><a href="#" className="text-xs text-gray-600 hover:text-[#8B1538] transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="text-xs text-gray-600 hover:text-[#8B1538] transition-colors">Disclaimer</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-200 pt-6 mt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
              <div className="mb-2 md:mb-0">
                © 2024 Axis Bank Ltd. All rights reserved.
              </div>
              <div className="flex flex-wrap gap-4">
                <a href="#" className="hover:text-[#8B1538] transition-colors">Sitemap</a>
                <a href="#" className="hover:text-[#8B1538] transition-colors">Careers</a>
                <a href="#" className="hover:text-[#8B1538] transition-colors">Investor Relations</a>
                <a href="#" className="hover:text-[#8B1538] transition-colors">Media</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
