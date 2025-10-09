import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { provisionIfKycComplete } from '../services/kycProvisioning';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [profile, setProfile] = useState(null); 
  const [loading, setLoading] = useState(true);
  const channelRef = useRef(null);

  const refreshProfile = async () => {
    try {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      if (!error && data) setProfile(data);
    } catch (_) {}
  };

  useEffect(() => {
    let userId = null;

    const loadUser = async () => {
      setLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        const user = session.user;
        setUser(user);
        userId = user.id;

        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single();

        if (!error) {
          setProfile(data);
        }

        // Subscribe to real-time updates for this user's profile
        channelRef.current?.unsubscribe?.();
        channelRef.current = supabase
          .channel('user-profile-updates')
          .on(
            'postgres_changes',
            {
              event: '*', 
              schema: 'public',
              table: 'users',
              filter: `id=eq.${userId}`, 
            },
            (payload) => {
              if (payload.new) {
                setProfile(payload.new);
              }
            }
          )
          .subscribe();
      }

      setLoading(false);
    };

    loadUser();

    const { data: authListener } = supabase?.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        // Signed in: set user, fetch profile, and subscribe to realtime updates
        const nextUser = session.user;
        setUser(nextUser);
        const uid = nextUser.id;
        try {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', uid)
            .single();
          if (!error && data) setProfile(data);
        } catch (_) {}

        // Reset and subscribe channel for this user
        channelRef.current?.unsubscribe?.();
        channelRef.current = supabase
          .channel('user-profile-updates')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'users',
              filter: `id=eq.${uid}`,
            },
            (payload) => {
              if (payload.new) {
                setProfile(payload.new);
              }
            }
          )
          .subscribe();
      } else {
        // Signed out: clear user and profile
        setUser(null);
        setProfile(null);
        channelRef.current?.unsubscribe?.();
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe?.();
      channelRef.current?.unsubscribe?.();
    };
  }, []);

  // When profile updates, if phone/bvn/nin are verified, provision external resources once
  const provisioningRanRef = useRef(false);
  useEffect(() => {
    const maybeProvision = async () => {
      if (!profile) return;
      const phoneOk = profile?.phone_verified === true;
      const bvnOk = profile?.bvn_verified === true;

      // Run when phone + BVN verified and we haven't run yet in this session
      if (phoneOk && bvnOk && !provisioningRanRef.current) {
        provisioningRanRef.current = true;
        try {
          console.log('[Provisioning] Triggered after phone + BVN');
          await provisionIfKycComplete(profile);
        } catch (e) {
          // Swallow errors; UI can still function and a later session can retry
          console.warn('Provisioning error:', e?.message || e);
        }
      }
    };

    maybeProvision();
  }, [profile]);

  return (
    <UserContext.Provider value={{ user, profile, loading, refreshProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
