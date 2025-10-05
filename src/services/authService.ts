import { supabase } from '../lib/supabase'
import type { User, UserPreferences } from '../lib/supabase'
import { ERROR_MESSAGES } from '../config'

export interface AuthResponse {
  success: boolean
  user?: User | null
  error?: string
  message?: string
}

export interface SignUpData {
  email: string
  password: string
  name: string
}

export interface SignInData {
  email: string
  password: string
}

export interface UserProfileUpdate {
  name?: string
  avatar_url?: string | null
  phone?: string | null
}

class AuthService {
  // Sign up new user
  async signUp({ email, password, name }: SignUpData): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          }
        }
      })

      if (error) {
        console.error('SignUp error:', error)
        return {
          success: false,
          error: error.message || ERROR_MESSAGES.AUTH_ERROR
        }
      }

      if (data.user) {
        // Create user profile in our users table
        await this.createUserProfile(data.user.id, {
          email,
          name,
        })
      }

      return {
        success: true,
        user: data.user as User,
        message: 'Hesap oluşturuldu! Email adresinizi kontrol edin.'
      }
    } catch (error) {
      console.error('SignUp exception:', error)
      return {
        success: false,
        error: ERROR_MESSAGES.AUTH_ERROR
      }
    }
  }

  // Sign in user
  async signIn({ email, password }: SignInData): Promise<AuthResponse> {
    try {
      console.log('AuthService: Starting signIn with email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      console.log('AuthService: Supabase auth response:', { data, error });

      if (error) {
        console.error('SignIn error:', error)
        return {
          success: false,
          error: error.message || ERROR_MESSAGES.AUTH_ERROR
        }
      }

      if (data.user) {
        console.log('AuthService: Auth user found, updating last login');
        // Update last login timestamp
        await this.updateLastLogin(data.user.id)
        
        console.log('AuthService: Fetching user profile from users table');
        // Get full user profile from our users table
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()

        console.log('AuthService: Profile query result:', { profile, profileError });

        if (profileError) {
          console.error('AuthService: Profile fetch error:', profileError);
          
          // If profile doesn't exist, create it
          if (profileError.code === 'PGRST116') { // No rows found
            console.log('AuthService: Profile not found, creating new profile');
            await this.createUserProfile(data.user.id, {
              email: data.user.email || '',
              name: data.user.user_metadata?.name || 'User'
            });
            
            // Try to fetch profile again
            const { data: newProfile, error: newProfileError } = await supabase
              .from('users')
              .select('*')
              .eq('id', data.user.id)
              .single()
            
            if (newProfileError || !newProfile) {
              return {
                success: false,
                error: 'Kullanıcı profili oluşturulamadı'
              }
            }
            
            return {
              success: true,
              user: newProfile as User,
              message: 'Başarıyla giriş yapıldı!'
            }
          }
          
          return {
            success: false,
            error: 'Kullanıcı profili bulunamadı'
          }
        }

        if (!profile) {
          console.error('AuthService: No profile found for user');
          return {
            success: false,
            error: 'Kullanıcı profili bulunamadı'
          }
        }

        console.log('AuthService: Returning successful response with user:', profile);
        return {
          success: true,
          user: profile as User,
          message: 'Başarıyla giriş yapıldı!'
        }
      }

      console.log('AuthService: No user in auth response');
      return {
        success: false,
        error: 'Kullanıcı bilgileri alınamadı'
      }
    } catch (error) {
      console.error('SignIn exception:', error)
      return {
        success: false,
        error: ERROR_MESSAGES.AUTH_ERROR
      }
    }
  }

  // Sign out user
  async signOut(): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('SignOut error:', error)
        return {
          success: false,
          error: error.message || ERROR_MESSAGES.AUTH_ERROR
        }
      }

      return {
        success: true,
        message: 'Başarıyla çıkış yapıldı!'
      }
    } catch (error) {
      console.error('SignOut exception:', error)
      return {
        success: false,
        error: ERROR_MESSAGES.AUTH_ERROR
      }
    }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Get full user profile from our users table
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        return profile as User
      }

      return null
    } catch (error) {
      console.error('Get current user error:', error)
      return null
    }
  }

  // Reset password
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)

      if (error) {
        console.error('Reset password error:', error)
        return {
          success: false,
          error: error.message || ERROR_MESSAGES.AUTH_ERROR
        }
      }

      return {
        success: true,
        message: 'Şifre sıfırlama linki email adresinize gönderildi.'
      }
    } catch (error) {
      console.error('Reset password exception:', error)
      return {
        success: false,
        error: ERROR_MESSAGES.AUTH_ERROR
      }
    }
  }

  // Update user profile
  async updateProfile(updates: UserProfileUpdate): Promise<AuthResponse> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return {
          success: false,
          error: 'Kullanıcı oturumu bulunamadı'
        }
      }

      const { error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        console.error('Update profile error:', error)
        return {
          success: false,
          error: error.message || ERROR_MESSAGES.DATABASE_ERROR
        }
      }

      return {
        success: true,
        message: 'Profil başarıyla güncellendi!'
      }
    } catch (error) {
      console.error('Update profile exception:', error)
      return {
        success: false,
        error: ERROR_MESSAGES.DATABASE_ERROR
      }
    }
  }

  // Get user preferences
  async getUserPreferences(userId?: string): Promise<UserPreferences | null> {
    try {
      let targetUserId = userId
      
      if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null
        targetUserId = user.id
      }

      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', targetUserId)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Get preferences error:', error)
        return null
      }

      console.log('AuthService: Retrieved user preferences:', JSON.stringify(data, null, 2));
      
      // Ensure interests field exists with a default value
      const preferences = data as UserPreferences;
      if (preferences && !preferences.interests) {
        preferences.interests = [];
      }
      
      return preferences
    } catch (error) {
      console.error('Get preferences exception:', error)
      return null
    }
  }

  // Update user preferences
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<AuthResponse> {
    try {
      console.log('AuthService: Updating preferences:', preferences);
      
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        console.log('AuthService: No user found for preferences update');
        return {
          success: false,
          error: 'Kullanıcı oturumu bulunamadı'
        }
      }

      console.log('AuthService: Upserting preferences for user:', user.id);
      
      // Log the exact payload being sent to database
      const upsertPayload = {
        user_id: user.id,
        ...preferences,
        // Ensure interests has a default value if not provided
        interests: preferences.interests || [],
        updated_at: new Date().toISOString()
      };
      console.log('AuthService: Upsert payload:', JSON.stringify(upsertPayload, null, 2));
      
      const { data, error } = await supabase
        .from('user_preferences')
        .upsert(upsertPayload)
        .select()

      console.log('AuthService: Preferences upsert result:', { data, error });

      if (error) {
        console.error('Update preferences error:', error)
        return {
          success: false,
          error: error.message || ERROR_MESSAGES.DATABASE_ERROR
        }
      }

      console.log('AuthService: Preferences updated successfully');
      return {
        success: true,
        message: 'Tercihler başarıyla güncellendi!'
      }
    } catch (error) {
      console.error('Update preferences exception:', error)
      return {
        success: false,
        error: ERROR_MESSAGES.DATABASE_ERROR
      }
    }
  }

  // Mark onboarding as completed
  async completeOnboarding(): Promise<AuthResponse> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return {
          success: false,
          error: 'Kullanıcı oturumu bulunamadı'
        }
      }

      const { error } = await supabase
        .from('users')
        .update({
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (error) {
        console.error('Complete onboarding error:', error)
        return {
          success: false,
          error: error.message || ERROR_MESSAGES.DATABASE_ERROR
        }
      }

      return {
        success: true,
        message: 'Onboarding tamamlandı!'
      }
    } catch (error) {
      console.error('Complete onboarding exception:', error)
      return {
        success: false,
        error: ERROR_MESSAGES.DATABASE_ERROR
      }
    }
  }

  // Subscribe to auth state changes
  onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const fullUser = await this.getCurrentUser()
        callback(fullUser)
      } else {
        callback(null)
      }
    })
  }

  // Private helper methods
  private async createUserProfile(userId: string, userData: { email: string; name: string }) {
    try {
      console.log('AuthService: Creating user profile for:', userId, userData);
      
      const { data, error } = await supabase
        .from('users')
        .insert({
          id: userId,
          email: userData.email,
          name: userData.name,
          onboarding_completed: false,
          is_active: true,
        })
        .select()

      console.log('AuthService: Create user profile result:', { data, error });

      if (error) {
        console.error('Create user profile error:', error)
      } else {
        console.log('AuthService: User profile created successfully:', data);
      }
    } catch (error) {
      console.error('Create user profile exception:', error)
    }
  }

  private async updateLastLogin(userId: string) {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          last_login_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) {
        console.error('Update last login error:', error)
      }
    } catch (error) {
      console.error('Update last login exception:', error)
    }
  }
}

export default new AuthService()