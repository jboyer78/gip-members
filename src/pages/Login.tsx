import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [searchParams] = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const verified = searchParams.get("verified");
    if (verified === "true") {
      toast({
        title: "Email vérifié",
        description: "Votre email a été vérifié avec succès. Vous pouvez maintenant vous connecter.",
      });
    }
  }, [searchParams, toast]);

  const handleSwitchToLogin = () => {
    setActiveTab("login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 md:px-0">
      <div className="w-full max-w-md space-y-6 md:space-y-8 p-6 md:p-8 bg-white rounded-xl shadow">
        <div className="text-center">
          <img 
            src="/lovable-uploads/ac77944b-d66c-46a5-820f-1a60225b7102.png" 
            alt="Logo GIP" 
            className="w-44 h-44 mx-auto mb-4"
          />
          <h2 className="text-lg text-gray-700">
            Connectez-vous ou créez un compte
          </h2>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger 
              value="login"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Connexion
            </TabsTrigger>
            <TabsTrigger 
              value="signup"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Inscription
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm />
          </TabsContent>

          <TabsContent value="signup">
            <SignUpForm onSwitchToLogin={handleSwitchToLogin} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Login;