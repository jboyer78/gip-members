import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TopNavigation() {
  return (
    <div className="flex items-center gap-3">
      <button className="p-2 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-full transition-all duration-300">
        <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
      </button>
      <Link to="/profile">
        <Avatar className="h-8 w-8 bg-muted">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </Link>
    </div>
  );
}