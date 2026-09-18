"use client";

import React, { useState } from "react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (phone: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("9876543210");
  const [otp, setOtp] = useState("123456");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(`+91 ${phoneNumber}`);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 animate-fadein font-sans select-none">
      <div className="bg-[#141414] border border-[#C9A55C]/40 rounded-3xl max-w-sm w-full p-6 flex flex-col gap-4 shadow-[0_0_40px_rgba(201,165,92,0.25)] relative text-left">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[rgba(250,250,250,0.08)] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#C9A55C]/15 border border-[#C9A55C]/40 flex items-center justify-center text-[#C9A55C] font-serif text-lg font-bold">
              ॐ
            </div>
            <h3 className="font-serif-fraunces text-lg font-bold text-[#FAFAFA]">
              {step === "phone" ? "Sacred Sign-In" : "Verify Security Code"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[rgba(250,250,250,0.4)] hover:text-[#FAFAFA] font-bold text-base cursor-pointer p-1"
          >
            ✕
          </button>
        </div>

        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <p className="text-xs text-[rgba(250,250,250,0.6)] leading-relaxed">
              Enter your mobile number to save your spiritual journey across devices.
            </p>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#C9A55C]">
                Mobile Phone Number
              </label>
              <div className="flex items-center gap-2">
                <span className="bg-[#0A0A0A] border border-[rgba(250,250,250,0.1)] rounded-xl px-3.5 py-3 text-xs font-bold text-[#FAFAFA]">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 bg-[#0A0A0A] border border-[rgba(250,250,250,0.1)] focus:border-[#C9A55C] rounded-xl px-4 py-3 text-xs text-[#FAFAFA] font-mono outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-1 bg-[#C9A55C] hover:bg-[#A8904D] text-[#0A0A0A] py-3.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Sending OTP..." : "Send OTP Code →"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <p className="text-xs text-[rgba(250,250,250,0.6)] leading-relaxed">
              Enter the 6-digit OTP code sent to <span className="font-bold text-[#FAFAFA]">+91 {phoneNumber}</span>.
            </p>

            <div className="bg-[#C9A55C]/15 border border-[#C9A55C]/30 rounded-xl p-2.5 text-center">
              <span className="text-[11px] font-bold text-[#C9A55C]">
                Test OTP Code: 123456
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10.5px] font-bold uppercase tracking-wider text-[#C9A55C]">
                6-Digit Security OTP Code
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-center tracking-[0.4em] font-mono bg-[#0A0A0A] border border-[rgba(250,250,250,0.1)] focus:border-[#C9A55C] rounded-xl py-3 text-lg text-[#FAFAFA] font-bold outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#C9A55C] hover:bg-[#A8904D] text-[#0A0A0A] py-3.5 rounded-xl font-bold text-xs transition-all shadow-md active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Verifying..." : "Verify & Continue →"}
            </button>

            <button
              type="button"
              onClick={() => setStep("phone")}
              className="text-[11px] font-semibold text-[#C9A55C] hover:underline self-center cursor-pointer"
            >
              Change Phone Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

