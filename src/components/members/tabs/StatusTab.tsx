import { Profile } from "@/integrations/supabase/types/profile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { StatusUpdateForm } from "./status/StatusUpdateForm";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { CardSide } from "@/components/member-card/CardSide";
import { FrontCard } from "@/components/member-card/FrontCard";
import { BackCard } from "@/components/member-card/BackCard";

interface StatusTabProps {
  user: Profile;
}

export const StatusTab = ({ user }: StatusTabProps) => {
  const [isEditingMemberNumber, setIsEditingMemberNumber] = useState(false);
  const [memberNumber, setMemberNumber] = useState(user.member_number || '');
  const { toast } = useToast();
  const [currentStatus, setCurrentStatus] = useState(user.status?.[0] || "Sympathisant");

  const { data: statusComments, isLoading, refetch } = useQuery({
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

  const handleMemberNumberUpdate = async () => {
    if (!memberNumber.trim()) {
      toast({
        title: "Erreur",
        description: "Le numéro d'adhérent ne peut pas être vide",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          member_number: memberNumber,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Succès",
        description: "Le numéro d'adhérent a été mis à jour",
      });
      setIsEditingMemberNumber(false);
    } catch (error) {
      console.error('Error updating member number:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du numéro d'adhérent",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = (newStatus: string) => {
    setCurrentStatus(newStatus);
    refetch();
  };

  const publicCardUrl = `https://gip-members.lovable.app/public-card/${user.id}`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Statut actuel</Label>
          <p className="text-lg font-semibold">
            {!currentStatus || currentStatus === "Sympathisant" 
              ? "En attente de validation" 
              : currentStatus}
          </p>
        </div>
        
        <div className="space-y-2">
          <Label>Numéro d'adhérent</Label>
          {isEditingMemberNumber ? (
            <div className="flex gap-2">
              <Input
                value={memberNumber}
                onChange={(e) => setMemberNumber(e.target.value)}
                placeholder="Numéro d'adhérent"
              />
              <Button onClick={handleMemberNumberUpdate}>Enregistrer</Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditingMemberNumber(false);
                  setMemberNumber(user.member_number || '');
                }}
              >
                Annuler
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {user.member_number ? (
                <a 
                  href="/member-card" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-lg hover:text-primary transition-colors"
                >
                  {user.member_number}
                </a>
              ) : (
                <span className="text-lg">Non défini</span>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditingMemberNumber(true)}
              >
                Modifier
              </Button>
            </div>
          )}
        </div>
      </div>

      <StatusUpdateForm user={user} onUpdate={handleStatusUpdate} />
      
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

      {currentStatus === "Validée" && (
        <div className="space-y-4 mt-8">
          <h3 className="text-lg font-semibold">Carte de membre</h3>
          <div className="max-w-2xl mx-auto">
            <ResizablePanelGroup direction="vertical" className="min-h-[800px] rounded-lg border">
              <ResizablePanel defaultSize={50}>
                <CardSide>
                  <FrontCard profile={user} />
                </CardSide>
              </ResizablePanel>
              <ResizablePanel defaultSize={50}>
                <CardSide>
                  <BackCard profile={user} publicCardUrl={publicCardUrl} />
                </CardSide>
              </ResizablePanel>
            </ResizablePanelGroup>
            <div className="text-center text-sm text-gray-500 mt-4">
              URL publique du QR code : {' '}
              <a 
                href={publicCardUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {publicCardUrl}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
