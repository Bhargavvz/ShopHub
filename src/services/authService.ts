import { supabase } from '../lib/supabase';
import { User, AuthResponse } from '../types';

export const authService = {
  async register(name: string, email: string, password: string): Promise<AuthResponse> {
    const { data: authData, error: authError } = await supabase.auth.signUp({      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Registration failed');

    // Wait for profile to be created by database trigger with retry logic
    const profile = await this.waitForProfile(authData.user.id, email, name);

    const user: User = {
      id: authData.user.id,
      email,
      name: profile?.name || name,
      role: profile?.role || 'user',
      created_at: profile?.created_at || new Date().toISOString(),
    };

    return {
      user,
      token: authData.session?.access_token || '',
    };
  },

  async waitForProfile(userId: string, email: string, name: string, maxRetries = 5) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      // Wait with exponential backoff
      await new Promise(resolve => setTimeout(resolve, 300 * attempt));

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profile) {
        console.log('Profile found on attempt', attempt);
        return profile;
      }

      if (profileError && !profileError.message.includes('No rows')) {
        console.error('Profile fetch error:', profileError);
      }

      console.log(`Waiting for profile creation... attempt ${attempt}/${maxRetries}`);
    }

    // If profile still doesn't exist after retries, try to create it manually
    console.warn('Profile not created by trigger, creating manually...');
    const { data: manualProfile, error: insertError } = await supabase
      .from('profiles')
      .insert({
        id: userId,
        email: email,
        name: name,
        role: 'user'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Manual profile creation failed:', insertError);
      return null;
    }

    return manualProfile;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        // Provide more specific error messages
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password');
        }
        if (authError.message.includes('Email not confirmed')) {
          throw new Error('Please verify your email address before logging in');
        }
        throw authError;
      }

      if (!authData.user || !authData.session) {
        throw new Error('Login failed - no session created');
      }

      // Optional: Check if email is confirmed (can be disabled in Supabase settings)
      const emailVerified = !!authData.user.email_confirmed_at;
      
      if (!emailVerified) {
        console.warn('User email not verified:', email);
        // Don't block login, just warn
      }

      // Fetch user profile with retry
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile fetch error during login:', profileError);
        throw new Error('Failed to load user profile. Please try again.');
      }

      if (!profile) {
        // Profile doesn't exist - try to create it
        console.warn('Profile missing for user, attempting to create...');
        const userName = authData.user.user_metadata?.name || email.split('@')[0];
        const createdProfile = await this.waitForProfile(
          authData.user.id,
          authData.user.email || email,
          userName
        );

        if (!createdProfile) {
          throw new Error('Profile not found. Please contact support or try registering again.');
        }

        const user: User = {
          id: createdProfile.id,
          email: createdProfile.email,
          name: createdProfile.name,
          role: createdProfile.role,
          created_at: createdProfile.created_at,
        };

        return {
          user,
          token: authData.session.access_token,
        };
      }

      const user: User = {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        created_at: profile.created_at,
      };

      return {
        user,
        token: authData.session.access_token,
      };
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async logout(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        return null;
      }

      const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();

      if (userError || !authUser) {
        console.error('Get user error:', userError);
        return null;
      }

      // Fetch profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile fetch error in getCurrentUser:', profileError);
        return null;
      }

      if (!profile) {
        console.warn('Profile not found for current user:', authUser.id);
        return null;
      }

      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        created_at: profile.created_at,
      };
    } catch (error) {
      console.error('getCurrentUser error:', error);
      return null;
    }
  },

  async updateProfile(userId: string, name: string): Promise<void> {
    const { error } = await supabase
      .from('profiles')
      .update({ name })
      .eq('id', userId);

    if (error) throw error;
  },

  async changePassword(newPassword: string): Promise<void> {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) throw error;
  },
};
