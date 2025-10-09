
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../../lib/supabase';

const BLOCKRADAR_API_KEY = 'kQlw7zKtfu2HnUBADXecuOARHvM9PfeiMmadfPNC6UGl39lK7dpG2abGsprgmN';
const BLOCKRADAR_WALLET_ID = '251db0e0-861f-468d-942f-2cd4e171738d'; 

export async function getOrCreateWallet(user) {
  try {
    // Step 1: Check Supabase for existing wallet
    const { data: existingWallet, error: checkError } = await supabase
      .from('user_wallets')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking wallet:', checkError);
      return null;
    }

    if (existingWallet) {
      console.log('Wallet already exists:', existingWallet.address);
      return existingWallet;
    }

    // Create wallet via BlockRadar
    const res = await fetch(
      `https://api.blockradar.co/v1/wallets/${BLOCKRADAR_WALLET_ID}/addresses`,
      {
        method: 'POST',
        headers: {
          'x-api-key': BLOCKRADAR_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: '',
          metadata: {
            user_id: user.id,
            email: user.email,
          },
          name: 'Customer Wallet',
        }),
      }
    );

    const json = await res.json();
    if (!res.ok) {
      console.error('BlockRadar error:', json);
      return null;
    }

    const walletData = json.data;

    // Step 3: Save to Supabase
    const { data: savedWallet, error: saveError } = await supabase
      .from('user_wallets')
      .insert([
        {
          user_id: user.id,
          address: walletData.address,
          name: walletData.name,
          metadata: walletData.metadata,
        },
      ])
      .select()
      .single();

    if (saveError) {
      console.error('Error saving wallet:', saveError);
      return null;
    }

    console.log('Wallet created & saved:', savedWallet);
    return savedWallet;
  } catch (err) {
    console.error('Unexpected error:', err);
    return null;
  }
}
