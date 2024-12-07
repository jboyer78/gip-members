import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { SidebarMenuItem as BaseSidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";

interface SidebarMenuItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  className?: string;
  isExternal?: boolean;
}

export const SidebarMenuItem = ({ to, icon: Icon, label, className = "", isExternal = false }: SidebarMenuItemProps) => {
  const linkContent = (
    <>
      <Icon className="h-6 w-6 text-gray-300 hover:text-white" />
      <span className="text-lg font-medium text-gray-300 hover:text-white">{label}</span>
    </>
  );

  return (
    <BaseSidebarMenuItem className={`list-none ${className}`}>
      <SidebarMenuButton asChild>
        {isExternal ? (
          <a 
            href={to} 
            className="flex items-center space-x-4 p-4 hover:bg-gray-700/90 rounded-lg transition-all duration-300"
          >
            {linkContent}
          </a>
        ) : (
          <Link 
            to={to} 
            className="flex items-center space-x-4 p-4 hover:bg-gray-700/90 rounded-lg transition-all duration-300"
          >
            {linkContent}
          </Link>
        )}
      </SidebarMenuButton>
    </BaseSidebarMenuItem>
  );
};