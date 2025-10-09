import API_ENDPOINTS from "./apiEndPoints";


export const sendOTP = async (email) => {
  try {
    const response = await fetch(API_ENDPOINTS.SEND_OTP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send OTP');
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Network error occurred');
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const response = await fetch(API_ENDPOINTS.VERIFY_OTP, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        email,
        otp: otp.join('') 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to verify OTP');
    }

    return data;
  } catch (error) {
    throw new Error(error.message || 'Network error occurred');
  }
}; 

export const sendWelcomeEmail = async (email,firstName) => {
  try {
    const response = await fetch(API_ENDPOINTS.SEND_WELCOME, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email,userName:firstName}),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send welcome email');
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}; 