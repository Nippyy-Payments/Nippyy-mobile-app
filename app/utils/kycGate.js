// Returns true if top KYC is complete (phone, bvn, nin)
export function isTopKycComplete(profile) {
  if (!profile) return false;
  return profile.phone_verified === true && profile.bvn_verified === true && profile.nin_verified === true;
}
