import { BASE_URL } from "../lib/apiEndPoints";

export async function requestPhoneOtp(phone) {
  try {
    const res = await fetch(`${BASE_URL}/phone/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    const data = await res.json().catch(() => null);
    if (res.ok) return { success: true, ...(data || {}) };
    return { success: false, message: data?.message || `Request failed (${res.status})` };
  } catch (e) {
    return { success: false, message: e?.message || "Failed to request OTP" };
  }
}

export async function verifyPhoneOtp(phone, otp) {
  try {
    const res = await fetch(`${BASE_URL}/phone/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp }),
    });
    const data = await res.json().catch(() => null);
    if (res.ok) return { success: true, ...(data || {}) };
    return { success: false, message: data?.message || `Verification failed (${res.status})` };
  } catch (e) {
    return { success: false, message: e?.message || "Failed to verify OTP" };
  }
}
