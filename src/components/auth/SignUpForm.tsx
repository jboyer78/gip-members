import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Icons } from "@/components/ui/icons";

interface SignUpFormProps {
  onSwitchToLogin?: () => void;
}

const SignUpForm = ({ onSwitchToLogin }: SignUpFormProps) => {
  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Google SignIn error:', error);
        toast.error(error.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error("Une erreur est survenue lors de la connexion avec Google");
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'apple',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) {
        console.error('Apple SignIn error:', error);
        toast.error(error.message);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error("Une erreur est survenue lors de la connexion avec Apple");
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        type="button" 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
        onClick={handleGoogleSignIn}
      >
        <Icons.google className="h-4 w-4" />
        Continuer avec Google
      </Button>

      <Button 
        type="button" 
        variant="outline" 
        className="w-full flex items-center justify-center gap-2"
        onClick={handleAppleSignIn}
      >
        <Icons.apple className="h-4 w-4" />
        Continuer avec Apple
      </Button>
    </div>
  );
};

export default SignUpForm;