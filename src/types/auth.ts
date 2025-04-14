export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  name?: string;
  display_name?: string;
  metadata?: {
    avatar_url?: string;
    email_verified?: boolean;
    full_name?: string;
  };
  created_at?: string;
  last_sign_in?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refresh_token: string;
  error?: string;
}

export interface LoginProps {
  onLogin: () => void;
}

export interface SignupProps {
  onSignup: () => void;
}

export interface ForgotPasswordProps {
  onResetRequest: (email: string) => void;
}

export interface AuthProps {
  onNavigate?: (path: string) => void;
}
