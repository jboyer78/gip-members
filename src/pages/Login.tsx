import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import SignUpForm from "@/components/auth/SignUpForm";

const Login = () => {
  const [activeTab, setActiveTab] = useState("login");

  const handleSwitchToLogin = () => {
    setActiveTab("login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 md:px-0">
      <div className="w-full max-w-md space-y-6 md:space-y-8 p-6 md:p-8 bg-white rounded-xl shadow">
        <div className="text-center">
          <img 
            src="/lovable-uploads/cabb0ff6-8a51-4eab-ac37-ba19b5101bcc.png" 
            alt="Logo GIP" 
            className="w-32 h-32 mx-auto mb-4"
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