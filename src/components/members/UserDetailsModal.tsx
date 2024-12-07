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

interface UserDetailsModalProps {
  user: Profile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserDetailsModal = ({ user, open, onOpenChange }: UserDetailsModalProps) => {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
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
            <PersonalTab user={user} />
          </TabsContent>

          <TabsContent value="contact" className="space-y-4">
            <ContactTab user={user} />
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