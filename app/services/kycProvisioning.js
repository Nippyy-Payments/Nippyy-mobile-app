import { supabase } from "../lib/supabase";
import { createPaystackVirtualAccount } from "../api/create-account-details/createPaystackVirtualAccount";
import { getOrCreateWallet } from "../api/create-address/index";

// Idempotent provisioning: create Paystack virtual account and BlockRadar wallet
// when Phone and BVN are verified. Safe to call multiple times.
export async function provisionIfKycComplete(profile) {
  if (!profile) return { ran: false };

  const phoneOk = profile?.phone_verified === true;
  const bvnOk = profile?.bvn_verified === true;

  if (!(phoneOk && bvnOk)) {
    return { ran: false, reason: "KYC (phone + BVN) not complete" };
  }

  // Get auth user for email
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ran: false, reason: "No auth user" };

  const results = { ran: true };

  // Create Paystack virtual account if missing
  try {
    if (!profile?.paystack_customer_id) {
      const res = await createPaystackVirtualAccount({
        userId: profile.id,
        email: user.email,
        firstName: profile.first_name,
        lastName: profile.last_name,
      });
      results.paystack = res;
    }
  } catch (e) {
    results.paystack = { success: false, message: e?.message };
  }

  // Create/get wallet address if missing in user_wallets
  try {
    // getOrCreateWallet is idempotent; it checks Supabase first
    const wallet = await getOrCreateWallet({ id: profile.id, email: user.email });
    results.wallet = wallet ? { success: true, wallet } : { success: false };
  } catch (e) {
    results.wallet = { success: false, message: e?.message };
  }

  return results;
}
