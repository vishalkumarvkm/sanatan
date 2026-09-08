import { UserProfile } from "@/types/onboarding";

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL ||
  "http://185.199.53.174:8000";

export interface SendOtpResponse {
  success: boolean;
  message: string;
  phone_number?: string;
  expires_in_seconds?: number;
  dev_otp?: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  access_token?: string;
  token_type?: string;
  user_id?: string;
  is_new_user?: boolean;
  message?: string;
}

export interface CreateUserPayload {
  name: string;
  phone_number: string;
  date_of_birth: string;
  time_of_birth: string;
  place_of_birth: string;
  language: string;
  current_state: string;
  working_hours: string;
  deity: string;
  inner_feeling: string;
  seeking: string;
}

export interface CreateUserResponse {
  success: boolean;
  message: string;
  user_id?: string;
}

export interface UserProfileFullResponse {
  success: boolean;
  user_id?: string;
  user?: any;
  profile?: any;
  birth_profile?: any;
  vedic_astrology?: any;
  canonical_persona?: any;
  message?: string;
}

/**
 * 1. Send OTP to phone number
 */
export const sendOtp = async (phoneNumber: string): Promise<SendOtpResponse> => {
  const endpoint = `${BASE_URL}/api/v1/auth/send-otp`;
  try {
    const formattedPhone = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+91${phoneNumber.replace(/\D/g, "").slice(-10)}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone_number: formattedPhone }),
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        message: data.message || "OTP sent successfully",
        phone_number: data.phone_number,
        expires_in_seconds: data.expires_in_seconds,
        dev_otp: data.dev_otp,
      };
    }
    return {
      success: false,
      message: data.detail || data.message || `Error: ${response.status}`,
    };
  } catch (error: any) {
    console.error("sendOtp API Error:", error);
    return {
      success: false,
      message: error.message || "Failed to reach OTP service",
    };
  }
};

/**
 * 2. Verify OTP code
 */
export const verifyOtp = async (
  phoneNumber: string,
  otp: string
): Promise<VerifyOtpResponse> => {
  const endpoint = `${BASE_URL}/api/v1/auth/verify-otp`;
  try {
    const formattedPhone = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+91${phoneNumber.replace(/\D/g, "").slice(-10)}`;

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone_number: formattedPhone, otp }),
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        access_token: data.access_token,
        token_type: data.token_type,
        user_id: data.user_id,
        is_new_user: data.is_new_user,
      };
    }
    return {
      success: false,
      message: data.detail || data.message || `Verification failed: ${response.status}`,
    };
  } catch (error: any) {
    console.error("verifyOtp API Error:", error);
    return {
      success: false,
      message: error.message || "Failed to verify OTP",
    };
  }
};

/**
 * 3. Create user / submit profile
 */
export const createUser = async (
  profile: UserProfile
): Promise<CreateUserResponse> => {
  const endpoint = `${BASE_URL}/api/v1/user/create`;
  try {
    const formattedPhone = profile.phone
      ? profile.phone.startsWith("+")
        ? profile.phone
        : `+91${profile.phone.replace(/\D/g, "").slice(-10)}`
      : "+918084507988";

    // Format DOB: YYYY-MM-DD
    const dob = profile.dateOfBirth || "2000-01-01";
    
    // Format TOB: HH:MM:SS.sssZ
    const tob = profile.timeOfBirth || "11:45:00.000Z";

    const payload: CreateUserPayload = {
      name: profile.name || "Seeker",
      phone_number: formattedPhone,
      date_of_birth: dob,
      time_of_birth: tob,
      place_of_birth: profile.placeOfBirth || "India",
      language: profile.language === "Hindi" || profile.language === "hi" ? "hi" : "en",
      current_state: profile.innerSeason || "Peaceful",
      working_hours: profile.workRhythm || profile.groundingTime || "Fixed hours",
      deity: profile.ishtDevta || "Shiva",
      inner_feeling: profile.feelingText || profile.innerSeason || "Hopeful",
      seeking: profile.seekingQuestion1 || "Peace and guidance",
    };

    const headers: Record<string, string> = {
      accept: "application/json",
      "Content-Type": "application/json",
    };

    if (profile.accessToken) {
      headers["Authorization"] = `Bearer ${profile.accessToken}`;
    }

    const response = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (response.ok || response.status === 201) {
      console.log("User Registered API Success:", data);
      return {
        success: true,
        message: data.message || "User registered successfully",
        user_id: data.user_id,
      };
    }
    return {
      success: false,
      message: data.detail || data.message || `Server error: ${response.status}`,
    };
  } catch (error: any) {
    console.error("createUser API Error:", error);
    return {
      success: false,
      message: error.message || "Failed to register user",
    };
  }
};

/**
 * 4. Get full user profile, birth details, panchang & canonical persona
 */
export const fetchUserProfile = async (
  userId: string
): Promise<UserProfileFullResponse> => {
  const endpoint = `${BASE_URL}/api/v1/user/${encodeURIComponent(userId)}`;
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        accept: "application/json",
      },
    });

    const data = await response.json();
    if (response.ok) {
      return {
        success: true,
        user_id: data.user_id,
        user: data.user,
        profile: data.profile,
        birth_profile: data.birth_profile,
        vedic_astrology: data.vedic_astrology,
        canonical_persona: data.canonical_persona,
      };
    }
    return {
      success: false,
      message: data.detail || data.message || `Status: ${response.status}`,
    };
  } catch (error: any) {
    console.error("fetchUserProfile API Error:", error);
    return {
      success: false,
      message: error.message || "Failed to fetch user profile",
    };
  }
};

/**
 * Backwards compatibility aliases
 */
export const submitOnboardingData = async (
  profile: UserProfile
): Promise<{ success: boolean; user_id?: string; message?: string }> => {
  const res = await createUser(profile);
  return {
    success: res.success,
    user_id: res.user_id,
    message: res.message,
  };
};

export const fetchGeneratedPersona = async (
  userId: string
): Promise<{ success: boolean; persona?: any; message?: string }> => {
  const res = await fetchUserProfile(userId);
  if (res.success && res.canonical_persona) {
    return {
      success: true,
      persona: res.canonical_persona,
    };
  }
  return {
    success: res.success,
    message: res.message,
  };
};
