import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const MemberCard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!isLoading && (!profile || !profile.member_number)) {
      toast({
        title: "Accès refusé",
        description: "Vous devez avoir un numéro d'adhérent pour accéder à votre carte de membre.",
        variant: "destructive",
      });
      navigate('/profile');
    }
  }, [profile, isLoading, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Chargement de votre carte de membre...</p>
        </div>
      </div>
    );
  }

  if (!profile?.member_number) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
            Carte de Membre
          </h1>
        </div>

        <div className="space-y-6">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              Numéro d'adhérent
            </p>
            <p className="text-2xl font-bold text-primary">
              {profile.member_number}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Nom</p>
              <p className="font-semibold">{profile.last_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Prénom</p>
              <p className="font-semibold">{profile.first_name}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Statut</p>
            <p className="font-semibold">{profile.status?.[0] || "En attente"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberCard;