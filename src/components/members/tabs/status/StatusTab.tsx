import { Profile } from "@/integrations/supabase/types/profile";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

interface StatusTabProps {
  user: Profile;
}

export const StatusTab = ({ user }: StatusTabProps) => {
  const [isEditingMemberNumber, setIsEditingMemberNumber] = useState(false);
  const [memberNumber, setMemberNumber] = useState(user.member_number || '');
  const { toast } = useToast();
  const { t } = useTranslation();

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

  const handleMemberNumberUpdate = async () => {
    if (!memberNumber.trim()) {
      toast({
        title: t('profile.error.title'),
        description: t('profile.memberNumber.required'),
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
        title: t('actions.save'),
        description: t('profile.success.update'),
      });
      setIsEditingMemberNumber(false);
    } catch (error) {
      console.error('Error updating member number:', error);
      toast({
        title: t('profile.error.title'),
        description: t('profile.error.generic'),
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 w-[300px]">
          <Label>{t('profile.currentStatus')}</Label>
          <p className="text-lg font-semibold">
            {!user.status?.[0] || user.status[0] === "Sympathisant" 
              ? t('profile.pending')
              : user.status[0]}
          </p>
        </div>
        
        <div className="space-y-2 w-[300px]">
          <Label>{t('profile.memberNumber')}</Label>
          {isEditingMemberNumber ? (
            <div className="flex gap-2">
              <Input
                value={memberNumber}
                onChange={(e) => setMemberNumber(e.target.value)}
                placeholder={t('profile.memberNumber')}
              />
              <Button onClick={handleMemberNumberUpdate}>{t('actions.save')}</Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditingMemberNumber(false);
                  setMemberNumber(user.member_number || '');
                }}
              >
                {t('actions.cancel')}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-lg">{user.member_number || t('profile.undefined')}</span>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsEditingMemberNumber(true)}
              >
                {t('actions.modify')}
              </Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{t('profile.statusHistory')}</h3>
        {isLoading ? (
          <p className="text-muted-foreground">{t('profile.loadingHistory')}</p>
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
          <p className="text-muted-foreground">{t('profile.noHistory')}</p>
        )}
      </div>
    </div>
  );
};