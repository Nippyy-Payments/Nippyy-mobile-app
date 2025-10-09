// nippyy api server base url (exported for reuse)
export const BASE_URL = 'https://7118b48593b5.ngrok-free.app/api';



//nippppyyyyy api endpoint
const API_ENDPOINTS = {
  SEND_OTP: `${BASE_URL}/email/send-otp`,
  VERIFY_OTP: `${BASE_URL}/email/verify-otp`,
  SEND_WELCOME: `${BASE_URL}/email/send-welcome`,
};

export default API_ENDPOINTS;
