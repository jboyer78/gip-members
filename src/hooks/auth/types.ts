export interface SignUpError {
  message: string;
  status?: number;
  body?: string;
  error_type?: string;
  url?: string;
}

export interface SignUpResult {
  success: boolean;
  error?: SignUpError;
}

export interface UseSignUpProps {
  onSwitchToLogin?: () => void;
}