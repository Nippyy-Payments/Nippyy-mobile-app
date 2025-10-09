import { supabase } from '../lib/supabase';

export const authService = {
  // Sign up a new user
  signUp: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Update user profile
  updateUserProfile: async (userId, userData) => {
    try {
      // Update the user profile in the users table
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: userId,
          first_name: userData.firstName,
          last_name: userData.lastName,
          updated_at: new Date(),
          account_location: userData.account_location,
          date_of_birth: userData.date_of_birth,
        })
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  },

  // Sign out
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  },
}; 