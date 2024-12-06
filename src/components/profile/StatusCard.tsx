import { Card, CardContent } from "@/components/ui/card";
import { Check, AlertCircle, Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const StatusCard = () => {
  const { data: userStatus } = useQuery({
    queryKey: ['userStatus'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('status')
        .eq('id', user.id)
        .single();

      return {
        email: user.email,
        status: profile?.status?.[0] || 'En attente'
      };
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Validée':
        return <Check className="w-8 h-8 text-green-500" />;
      case 'Refusée':
        return <AlertCircle className="w-8 h-8 text-red-500" />;
      case 'En attente':
      default:
        return <Loader className="w-8 h-8 text-yellow-500 animate-spin" />;
    }
  };

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Statut de votre inscription</h2>
        <div className="flex justify-center items-center h-[120px]">
          {userStatus && getStatusIcon(userStatus.status)}
        </div>
      </CardContent>
    </Card>
  );
};