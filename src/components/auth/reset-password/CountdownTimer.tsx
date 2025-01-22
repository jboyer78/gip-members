import { useTranslation } from "react-i18next";

interface CountdownTimerProps {
  countdown: string;
}

const CountdownTimer = ({ countdown }: CountdownTimerProps) => {
  const { t } = useTranslation();
  
  if (!countdown) return null;
  
  return (
    <div className="text-center text-sm text-gray-600">
      {t("auth.resetPassword.countdown")}<span className="font-medium text-primary">{countdown}</span>
    </div>
  );
};

export default CountdownTimer;