import { Progress } from "@/components/ui/progress";

interface MemberProgressBarProps {
  value: number;
}

export const MemberProgressBar = ({ value }: MemberProgressBarProps) => (
  <div className="space-y-1">
    <Progress value={value} className="h-2" />
    <p className="text-xs text-gray-500 dark:text-gray-400 text-right">{value}%</p>
  </div>
);