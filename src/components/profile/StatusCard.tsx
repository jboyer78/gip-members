import { Card, CardContent } from "@/components/ui/card";
import { Check, AlertCircle, Loader } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export const StatusCard = () => {
  const { data: userStatus } = useQuery({
    queryKey: ['userStatus'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      // Fetch profile status and member number
      const { data: profile } = await supabase
        .from('profiles')
        .select('status, member_number')
        .eq('id', user.id)
        .single();

      // Fetch latest comment
      const { data: comments } = await supabase
        .from('status_comments')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      return {
        email: user.email,
        status: profile?.status?.[0] || 'En attente',
        memberNumber: profile?.member_number,
        lastComment: comments?.[0]?.comment || null,
        commentDate: comments?.[0]?.created_at || null
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'Validée':
        return 'Validée';
      case 'Refusée':
        return 'Refusée';
      case 'En attente':
      default:
        return 'En cours de traitement';
    }
  };

  if (!userStatus) return null;

  return (
    <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50 shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Statut de votre inscription</h2>
        <div className="flex flex-col items-center justify-center space-y-4">
          {getStatusIcon(userStatus.status)}
          <span className={`font-medium ${
            userStatus.status === 'Validée' ? 'text-green-600' :
            userStatus.status === 'Refusée' ? 'text-red-600' :
            'text-yellow-600'
          }`}>
            {getStatusText(userStatus.status)}
          </span>
          {userStatus.status === 'Validée' && userStatus.memberNumber && (
            <div className="text-center mt-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Numéro d'adhérent
              </p>
              <p className="text-lg font-semibold text-primary">
                {userStatus.memberNumber}
              </p>
            </div>
          )}
          {userStatus.lastComment && (
            <div className="space-y-2 text-center mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
                {userStatus.lastComment}
              </p>
              {userStatus.commentDate && (
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {format(new Date(userStatus.commentDate), "d MMMM yyyy 'à' HH:mm", { locale: fr })}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};