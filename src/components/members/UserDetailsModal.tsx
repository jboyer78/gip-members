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
      <DialogContent className="max-w-[90vw] max-h-[90vh] w-[1200px] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar_url || ''} />
            <AvatarFallback>
              {user.first_name && user.last_name 
                ? `${user.first_name[0]}${user.last_name[0]}`
                : 'U'}
            </AvatarFallback>
          </Avatar>
          <DialogTitle className="text-2xl">
            {user.first_name} {user.last_name}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Informations personnelles</TabsTrigger>
            <TabsTrigger value="contact">Coordonnées</TabsTrigger>
            <TabsTrigger value="professional">Informations professionnelles</TabsTrigger>
            <TabsTrigger value="status">Statut d'inscription</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <PersonalTab user={user} onUpdate={handleProfileUpdate} />
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <ContactTab user={user} onUpdate={handleProfileUpdate} />
          </TabsContent>

          <TabsContent value="professional" className="space-y-4">
            <ProfessionalTab user={user} />
          </TabsContent>

          <TabsContent value="status" className="space-y-4">
            <StatusTab user={user} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};