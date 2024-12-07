import { Profile } from "@/integrations/supabase/types/profile";
import { StatusDisplay } from "./status/StatusDisplay";
import { StatusUpdateForm } from "./status/StatusUpdateForm";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StatusTabProps {
  user: Profile;
}

export const StatusTab = ({ user }: StatusTabProps) => {
  const { data: statusComments, isLoading } = useQuery({
    queryKey: ['statusComments', user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('status_comments')
        .select('*')
        .eq('profile_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    }
  });

  // Récupérer le dernier commentaire correspondant au statut actuel
  const latestComment = statusComments?.find(
    comment => comment.status === user.status?.[0]
  )?.comment;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <StatusDisplay 
          currentStatus={user.status?.[0]} 
          latestComment={latestComment}
        />
      </div>
      
      <StatusUpdateForm user={user} />

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Historique des statuts</h3>
        {isLoading ? (
          <p className="text-muted-foreground">Chargement de l'historique...</p>
        ) : statusComments?.length ? (
          <div className="space-y-4">
            {statusComments.map((comment) => (
              <div 
                key={comment.id} 
                className="p-4 rounded-lg border bg-muted/50"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium">{comment.status}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(comment.created_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                {comment.comment && (
                  <p className="text-sm text-muted-foreground">{comment.comment}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Aucun historique disponible</p>
        )}
      </div>
    </div>
  );
};