
const BASE_URL = "https://api.paystack.co";
const SECRET_KEY = "sk_live_3e4d5995b854e141aa35656bcf05aa7618a5109b"; 

// Headers to reuse
const headers = {
  Authorization: `Bearer ${SECRET_KEY}`,
  "Content-Type": "application/json",
};

// Fetch list of all banks with logos
export const fetchBanks = async () => {
  try {
    const response = await fetch(`${BASE_URL}/bank`, {
      method: "GET",
      headers,
    });

    const result = await response.json();

    if (result.status) {
      return result.data; 
    } else {
      throw new Error(result.message || "Failed to load banks");
    }
  } catch (error) {
    console.error("fetchBanks error:", error.message);
    throw error;
  }
};

// Resolve bank account name
export const resolveAccount = async (accountNumber, bankCode) => {
  try {
    const url = `${BASE_URL}/bank/resolve?account_number=${accountNumber}&bank_code=${bankCode}`;

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    const result = await response.json();

    if (result.status) {
      return result.data; 
    } else {
      throw new Error(result.message || "Account verification failed");
    }
  } catch (error) {
    console.error("resolveAccount error:", error.message);
    throw error;
  }
};
