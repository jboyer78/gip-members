import ReCAPTCHA from "react-google-recaptcha";

interface LoginCaptchaProps {
  onCaptchaChange: (token: string | null) => void;
}

export const LoginCaptcha = ({ onCaptchaChange }: LoginCaptchaProps) => (
  <div className="flex justify-center">
    <ReCAPTCHA
      sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
      onChange={onCaptchaChange}
    />
  </div>
);