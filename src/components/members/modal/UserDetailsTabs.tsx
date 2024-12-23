import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Profile } from "@/integrations/supabase/types/profile";
import { PersonalTab } from "../tabs/PersonalTab";
import { ContactTab } from "../tabs/ContactTab";
import { ProfessionalTab } from "../tabs/ProfessionalTab";
import { StatusTab } from "../tabs/StatusTab";
import { BankingTab } from "../tabs/BankingTab";

interface UserDetailsTabsProps {
  user: Profile;
  onUpdate: (updatedProfile: Profile) => void;
}

export const UserDetailsTabs = ({ user, onUpdate }: UserDetailsTabsProps) => {
  return (
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
          <PersonalTab user={user} onUpdate={onUpdate} />
        </TabsContent>

        <TabsContent value="contact" className="space-y-4 mt-0">
          <ContactTab user={user} onUpdate={onUpdate} />
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
  );
};