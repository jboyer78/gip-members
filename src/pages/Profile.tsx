import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useProfileForm } from "@/components/profile/useProfileForm";
import { useProfessionalForm } from "@/components/profile/useProfessionalForm";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { TopNavigation } from "@/components/shared/TopNavigation";
import { supabase } from "@/integrations/supabase/client";
import { PersonalSection } from "@/components/profile/sections/PersonalSection";
import { ProfessionalSection } from "@/components/profile/sections/ProfessionalSection";
import { StatusSection } from "@/components/profile/sections/StatusSection";
import { BankingSection } from "@/components/profile/sections/BankingSection";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "@/components/shared/LanguageSelector";

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { form: personalForm, onSubmit: onPersonalSubmit } = useProfileForm();
  const { form: professionalForm, onSubmit: onProfessionalSubmit } = useProfessionalForm();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) throw authError;
        
        if (!user) {
          navigate("/login");
          return;
        }

        const { error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        setIsLoading(false);
      } catch (err) {
        console.error('Error loading profile:', err);
        setError(err instanceof Error ? err.message : t('profile.error.update'));
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, t]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{t('profile.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400 mb-4">
            {t('profile.error.title')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-primary text-white py-2 px-4 rounded hover:bg-primary/90 transition-colors"
          >
            {t('actions.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <AppSidebar />
        
        <main className="flex-1 p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="p-2 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
                  {t('profile.manageProfile')}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('profile.personalInfo')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSelector />
              <TopNavigation />
            </div>
          </div>

          <div className="space-y-6">
            <StatusSection form={personalForm} />
            <PersonalSection form={personalForm} onSubmit={onPersonalSubmit} />
            <ProfessionalSection form={professionalForm} onSubmit={onProfessionalSubmit} />
            <BankingSection />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Profile;