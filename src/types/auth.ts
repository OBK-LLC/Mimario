export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface LoginProps {
  onLogin: () => void;
}

export interface SignupProps {
  onSignup: () => void;
}

export interface AuthProps {
  onNavigate?: (path: string) => void;
}
