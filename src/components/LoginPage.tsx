"use client";

import React, { useState, useEffect } from "react";

interface LoginPageProps {
  onLoginSuccess: (phone: string) => void;
  onExploreGuest: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onExploreGuest,
}) => {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("9876543210");
  const [otp, setOtp] = useState(["1", "2", "3", "4", "5", "6"]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(45);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep("otp");
      setTimer(45);
    }, 800);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.charAt(value.length - 1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess(`+91 ${phoneNumber}`);
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen bg-[radial-gradient(120%_65%_at_50%_-10%,var(--prabhat-deep)_0%,var(--prabhat-cream)_55%)] flex flex-col items-center justify-center px-4 py-8 text-[#362A22] font-sans no-scrollbar">
      
      {/* BRANDING LOGO */}
      <div className="flex flex-col items-center gap-1.5 mb-6 text-center">
        <div className="w-14 h-14 rounded-full bg-[#FFFDF9] border border-[rgba(54,42,34,0.15)] flex items-center justify-center shadow-sm mb-1">
          <span className="devanagari-font text-2xl text-[#B4392B] font-bold">ॐ</span>
        </div>
        <h1 className="font-serif text-[24px] sm:text-[28px] font-bold text-[#362A22]">
          SpiritualSakha
        </h1>
        <p className="text-[12.5px] text-[#6B5C4E] font-medium">
          Whatever life brings, find your path.
        </p>
      </div>

      {/* LOGIN CARD */}
      <div className="bg-[#FFFDF9] border border-[rgba(54,42,34,0.13)] rounded-[28px] max-w-md w-full p-6 sm:p-8 shadow-xl flex flex-col gap-5 animate-fade-in">
        
        {step === "phone" ? (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
            <div>
              <h2 className="font-serif text-[20px] font-bold text-[#362A22]">
                Sign In or Register
              </h2>
              <p className="text-[12.5px] text-[#6B5C4E] leading-relaxed mt-1">
                Enter your phone number to receive a 6-digit verification code.
              </p>
            </div>

            <div>
              <label className="text-[11px] font-extrabold uppercase text-[#6B5C4E] tracking-wider mb-2 block">
                Mobile Number
              </label>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-[#FBF3E6] border border-[rgba(54,42,34,0.15)] rounded-[16px] px-3.5 py-3 text-[13.5px] font-bold text-[#362A22] shadow-2xs">
                  <span>🇮🇳</span>
                  <span>+91</span>
                </div>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="flex-1 border border-[rgba(54,42,34,0.15)] bg-[#FBF3E6] rounded-[16px] px-4 py-3 text-[14px] text-[#362A22] font-bold outline-none focus:border-[#B4392B] shadow-2xs"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || phoneNumber.length < 10}
              className="bg-[#B4392B] hover:bg-[#8E2C21] text-[#FFFDF9] py-3.5 rounded-[16px] font-bold text-[14px] transition-all shadow-md active:scale-98 disabled:opacity-50 mt-1"
            >
              {loading ? "Sending Verification Code..." : "Get Verification Code →"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
            <div>
              <div className="flex justify-between items-center">
                <h2 className="font-serif text-[20px] font-bold text-[#362A22]">
                  Enter 6-Digit OTP
                </h2>
                <button
                  type="button"
                  onClick={() => setStep("phone")}
                  className="text-[12px] text-[#B4392B] font-bold hover:underline"
                >
                  Edit Number
                </button>
              </div>
              <p className="text-[12.5px] text-[#6B5C4E] leading-relaxed mt-1">
                We sent a 6-digit code to <span className="font-bold text-[#362A22]">+91 {phoneNumber}</span>.
              </p>
            </div>

            {/* 6-Digit Box Input */}
            <div>
              <label className="text-[10.5px] font-extrabold uppercase text-[#6B5C4E] tracking-wider mb-2 block">
                Verification Code (Demo: 123456)
              </label>
              <div className="flex items-center justify-between gap-1.5">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    className="w-11 h-12 text-center text-[18px] font-mono font-bold border border-[rgba(54,42,34,0.18)] bg-[#FBF3E6] rounded-[14px] text-[#362A22] outline-none focus:border-[#B4392B] shadow-2xs"
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center text-[12px]">
              <span className="text-[#6B5C4E]">Didn&apos;t receive code?</span>
              {timer > 0 ? (
                <span className="font-bold text-[#6B5C4E]">Resend in {timer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={() => setTimer(45)}
                  className="font-bold text-[#B4392B] hover:underline"
                >
                  Resend OTP Now
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-[#B4392B] hover:bg-[#8E2C21] text-[#FFFDF9] py-3.5 rounded-[16px] font-bold text-[14px] transition-all shadow-md active:scale-98 disabled:opacity-50 mt-1"
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
            </button>
          </form>
        )}

        <div className="border-t border-[rgba(54,42,34,0.1)] pt-4 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={onExploreGuest}
            className="text-[13px] font-bold text-[#362A22] hover:text-[#B4392B] transition-colors"
          >
            Continue as Guest / Explore Shrine →
          </button>
          <p className="text-[10.5px] text-[#6B5C4E] text-center leading-relaxed">
            🔒 Protected under India&apos;s Digital Personal Data Protection (DPDP) Act. Your data is encrypted and secure.
          </p>
        </div>

      </div>

    </div>
  );
};
