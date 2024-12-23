import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Profile } from "@/integrations/supabase/types/profile";
import { PersonalTab } from "./tabs/PersonalTab";
import { ContactTab } from "./tabs/ContactTab";
import { ProfessionalTab } from "./tabs/ProfessionalTab";
import { StatusTab } from "./tabs/StatusTab";
import { BankingTab } from "./tabs/BankingTab";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

interface UserDetailsModalProps {
  user: Profile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate?: () => void;
}

export const UserDetailsModal = ({ 
  user: initialUser, 
  open, 
  onOpenChange,
  onUpdate 
}: UserDetailsModalProps) => {
  const [user, setUser] = useState<Profile | null>(initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  if (!user) return null;

  const handleProfileUpdate = async (updatedProfile: Profile) => {
    setUser(updatedProfile);
    if (onUpdate) {
      await onUpdate();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-[90vw] max-h-[95vh] md:max-h-[90vh] w-full md:w-[1200px] overflow-y-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border border-gray-200/50 dark:border-gray-700/50 shadow-xl transition-all duration-200 ease-in-out">
        <DialogHeader className="flex flex-col md:flex-row items-start md:items-center gap-4 p-6 border-b border-gray-200/50 dark:border-gray-700/50">
          <Avatar className="h-16 w-16 md:h-20 md:w-20 ring-2 ring-primary/10 transition-all duration-200">
            <AvatarImage src={user.avatar_url || ''} className="object-cover" />
            <AvatarFallback className="text-lg md:text-xl bg-primary/5">
              {user.first_name && user.last_name 
                ? `${user.first_name[0]}${user.last_name[0]}`
                : 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <DialogTitle className="text-2xl md:text-3xl font-semibold">
              {user.first_name} {user.last_name}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              N° Adhérent: {user.member_number || 'Non défini'}
            </p>
          </div>
        </DialogHeader>

        <Tabs defaultValue="personal" className="w-full p-4 md:p-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 gap-1 md:gap-2 mb-4 md:mb-6">
            <TabsTrigger value="personal" className="data-[state=active]:bg-primary/10 transition-all duration-200 text-xs md:text-sm px-2 py-1.5 md:px-3 md:py-2 h-auto">
              Informations personnelles
            </TabsTrigger>
            <TabsTrigger value="contact" className="data-[state=active]:bg-primary/10 transition-all duration-200 text-xs md:text-sm px-2 py-1.5 md:px-3 md:py-2 h-auto">
              Coordonnées
            </TabsTrigger>
            <TabsTrigger value="professional" className="data-[state=active]:bg-primary/10 transition-all duration-200 text-xs md:text-sm px-2 py-1.5 md:px-3 md:py-2 h-auto">
              Informations professionnelles
            </TabsTrigger>
            <TabsTrigger value="banking" className="data-[state=active]:bg-primary/10 transition-all duration-200 text-xs md:text-sm px-2 py-1.5 md:px-3 md:py-2 h-auto">
              Informations bancaires
            </TabsTrigger>
            <TabsTrigger value="status" className="data-[state=active]:bg-primary/10 transition-all duration-200 text-xs md:text-sm px-2 py-1.5 md:px-3 md:py-2 h-auto">
              Statut d'inscription
            </TabsTrigger>
          </TabsList>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 md:p-6 shadow-sm">
            <TabsContent value="personal" className="space-y-4 mt-0">
              <PersonalTab user={user} onUpdate={handleProfileUpdate} />
            </TabsContent>

            <TabsContent value="contact" className="space-y-4 mt-0">
              <ContactTab user={user} onUpdate={handleProfileUpdate} />
            </TabsContent>

            <TabsContent value="professional" className="space-y-4 mt-0">
              <ProfessionalTab user={user} />
            </TabsContent>

            <TabsContent value="banking" className="space-y-4 mt-0">
              <BankingTab user={user} />
            </TabsContent>

            <TabsContent value="status" className="space-y-4 mt-0">
              <StatusTab user={user} />
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};