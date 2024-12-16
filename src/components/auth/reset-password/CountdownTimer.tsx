interface CountdownTimerProps {
  countdown: string;
}

const CountdownTimer = ({ countdown }: CountdownTimerProps) => {
  if (!countdown) return null;
  
  return (
    <div className="text-center text-sm text-gray-600">
      Temps restant avant de pouvoir réessayer : <span className="font-medium text-primary">{countdown}</span>
    </div>
  );
};

export default CountdownTimer;