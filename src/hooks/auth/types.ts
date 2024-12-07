export interface SignUpError {
  message: string;
  status?: number;
}

export interface SignUpResult {
  success: boolean;
  error?: SignUpError;
}

export interface UseSignUpProps {
  onSwitchToLogin?: () => void;
}