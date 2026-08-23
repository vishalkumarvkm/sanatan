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
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
    }, 800);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(`+91 ${phoneNumber}`);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-[#FFFDF9] border border-[rgba(54,42,34,0.13)] rounded-[28px] max-w-sm w-full p-6 flex flex-col gap-4 animate-fade-in shadow-2xl">
        <div className="flex justify-between items-center border-b border-[rgba(54,42,34,0.1)] pb-3">
          <div className="flex items-center gap-2">
            <span className="devanagari-font text-xl text-[#B4392B]">ॐ</span>
            <h3 className="font-serif text-[18px] font-bold text-[#362A22]">
              {step === "phone" ? "SpiritualSakha Login" : "Verify 6-Digit OTP"}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#6B5C4E] font-bold text-base hover:text-[#362A22]"
          >
            ✕
          </button>
        </div>

        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <p className="text-[12.5px] text-[#6B5C4E] leading-relaxed">
              Enter your mobile number to sign in or create your SpiritualSakha profile.
            </p>

            <div>
              <label className="text-[11px] font-bold uppercase text-[#6B5C4E] mb-1.5 block">
                Mobile Phone Number
              </label>
              <div className="flex items-center gap-2">
                <span className="bg-[#FBF3E6] border border-[rgba(54,42,34,0.15)] rounded-[14px] px-3 py-3 text-[13.5px] font-bold text-[#362A22]">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 border border-[rgba(54,42,34,0.15)] bg-[#FBF3E6] rounded-[14px] px-3.5 py-3 text-[13.5px] text-[#362A22] font-bold outline-none focus:border-[#B4392B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#B4392B] text-[#FFFDF9] py-3 rounded-[16px] font-bold text-sm hover:bg-[#8E2C21] transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Get Verification Code →"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <p className="text-[12.5px] text-[#6B5C4E] leading-relaxed">
              We sent a 6-digit verification code to <span className="font-bold text-[#362A22]">+91 {phoneNumber}</span>.
            </p>

            <div>
              <label className="text-[11px] font-bold uppercase text-[#6B5C4E] mb-1.5 block">
                Enter 6-Digit OTP (Test: 123456)
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full text-center tracking-[0.4em] font-mono border border-[rgba(54,42,34,0.15)] bg-[#FBF3E6] rounded-[14px] py-3 text-[18px] text-[#362A22] font-bold outline-none focus:border-[#B4392B]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#B4392B] text-[#FFFDF9] py-3 rounded-[16px] font-bold text-sm hover:bg-[#8E2C21] transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
            </button>

            <button
              type="button"
              onClick={() => setStep("phone")}
              className="text-[12px] font-bold text-[#6B5C4E] underline self-center hover:text-[#362A22]"
            >
              Change Phone Number
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
