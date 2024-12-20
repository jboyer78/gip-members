import { Profile } from "@/integrations/supabase/types/profile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface StatusTabProps {
  user: Profile;
}

export const StatusTab = ({ user }: StatusTabProps) => {
  const [isEditingMemberNumber, setIsEditingMemberNumber] = useState(false);
  const [memberNumber, setMemberNumber] = useState(user.member_number || '');
  const [newStatus, setNewStatus] = useState<string>("");
  const [comment, setComment] = useState("");
  const { toast } = useToast();

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

  const handleStatusUpdate = async () => {
    if (!newStatus) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner un statut",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      
      if (!currentUser) {
        throw new Error("Utilisateur non connecté");
      }

      // Update profile status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          status: [newStatus],
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Add status comment if provided
      if (comment.trim()) {
        const { error: commentError } = await supabase
          .from('status_comments')
          .insert({
            profile_id: user.id,
            status: newStatus,
            comment: comment.trim(),
            created_by: currentUser.id
          });

        if (commentError) throw commentError;
      }

      await refetch();
      
      toast({
        title: "Succès",
        description: "Le statut a été mis à jour avec succès",
      });
      
      setNewStatus("");
      setComment("");
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour du statut",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Statut actuel</Label>
          <p className="text-lg font-semibold">
            {!user.status?.[0] || user.status[0] === "Sympathisant" 
              ? "En attente de validation" 
              : user.status[0]}
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
              <span className="text-lg">{user.member_number || 'Non défini'}</span>
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

      <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
        <h3 className="text-lg font-semibold mb-4">Mettre à jour le statut</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Nouveau statut</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="En attente">En attente</SelectItem>
                <SelectItem value="Validée">Validée</SelectItem>
                <SelectItem value="Refusée">Refusée</SelectItem>
                <SelectItem value="Suspendue">Suspendue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Commentaire</Label>
            <Textarea
              placeholder="Ajouter un commentaire concernant le changement de statut..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <Button onClick={handleStatusUpdate} className="w-full">
            Mettre à jour le statut
          </Button>
        </div>
      </div>

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