import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { TopNavigation } from "@/components/shared/TopNavigation";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { differenceInYears } from "date-fns";
import { Progress } from "@/components/ui/progress";

const Members = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);

  const { data: profiles, isLoading } = useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('last_name', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  const calculateAge = (birthDate: string | null) => {
    if (!birthDate) return '-';
    return differenceInYears(new Date(), new Date(birthDate));
  };

  const calculateCompletionPercentage = (profile: any) => {
    const personalFields = [
      'first_name',
      'last_name',
      'birth_date',
      'birth_city',
      'birth_department',
      'blood_type',
      'marital_status',
      'children_count',
      'phone_home',
      'phone_mobile',
      'email',
      'street',
      'postal_code',
      'city',
      'country'
    ];

    const filledFields = personalFields.filter(field => 
      profile[field] !== null && profile[field] !== ''
    );

    return Math.round((filledFields.length / personalFields.length) * 100);
  };

  const calculateProfessionalCompletionPercentage = (profile: any) => {
    const professionalFields = [
      'status',
      'administration',
      'administration_entry_date',
      'training_site',
      'grade',
      'assignment_direction',
      'assignment_service',
      'professional_document_url'
    ];

    const filledFields = professionalFields.filter(field => {
      if (field === 'status') {
        return profile[field] && profile[field].length > 0;
      }
      return profile[field] !== null && profile[field] !== '';
    });

    return Math.round((filledFields.length / professionalFields.length) * 100);
  };

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <AppSidebar />
        
        <main className="flex-1 p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="p-2 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">Membres</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Liste des membres de l'organisation</p>
              </div>
            </div>
            <TopNavigation />
          </div>

          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg p-6">
            {isLoading ? (
              <p className="text-gray-600 dark:text-gray-400">Chargement des membres...</p>
            ) : (
              <ScrollArea className="h-[600px] rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Photo</TableHead>
                      <TableHead>Prénom</TableHead>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Âge</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Direction</TableHead>
                      <TableHead>Informations personnelles</TableHead>
                      <TableHead>Informations professionnelles</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles?.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell>
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={profile.avatar_url || ''} />
                            <AvatarFallback>
                              {profile.first_name && profile.last_name 
                                ? `${profile.first_name[0]}${profile.last_name[0]}`
                                : 'U'}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>{profile.first_name || '-'}</TableCell>
                        <TableCell>{profile.last_name || '-'}</TableCell>
                        <TableCell>{profile.email || '-'}</TableCell>
                        <TableCell>{calculateAge(profile.birth_date)}</TableCell>
                        <TableCell>{profile.grade || '-'}</TableCell>
                        <TableCell>{profile.assignment_service || '-'}</TableCell>
                        <TableCell>{profile.assignment_direction || '-'}</TableCell>
                        <TableCell className="w-32">
                          <Progress value={calculateCompletionPercentage(profile)} className="h-2" />
                        </TableCell>
                        <TableCell className="w-32">
                          <Progress value={calculateProfessionalCompletionPercentage(profile)} className="h-2" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Members;