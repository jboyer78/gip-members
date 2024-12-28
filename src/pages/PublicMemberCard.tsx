import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel } from "@/components/ui/resizable";
import { CardSide } from "@/components/member-card/CardSide";
import { FrontCard } from "@/components/member-card/FrontCard";
import { BackCard } from "@/components/member-card/BackCard";

const PublicMemberCard = () => {
  const { id } = useParams();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['public-profile', id],
    queryFn: async () => {
      if (!id) throw new Error('No ID provided');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id, // Only run query if we have an ID
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-red-500">Carte de membre non trouvée</p>
      </div>
    );
  }

  const publicCardUrl = `${window.location.origin}/public-card/${id}`;

  return (
    <div className="min-h-screen flex w-full flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-8">
          <ResizablePanelGroup 
            direction="vertical" 
            className="min-h-[1000px] rounded-lg border space-y-0 md:space-y-4"
          >
            <ResizablePanel defaultSize={50}>
              <CardSide>
                <FrontCard profile={profile} />
              </CardSide>
            </ResizablePanel>

            <div className="h-4 block md:hidden" />

            <ResizablePanel defaultSize={50}>
              <CardSide>
                <BackCard profile={profile} publicCardUrl={publicCardUrl} />
              </CardSide>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </main>
    </div>
  );
};

export default PublicMemberCard;