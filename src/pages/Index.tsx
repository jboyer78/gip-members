import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-6 p-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Bienvenue sur G.I.P.
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-md mx-auto">
          Connectez-vous pour accéder à votre espace membre
        </p>
        <div className="space-x-4">
          <Button 
            onClick={() => navigate("/login")}
            size="lg"
          >
            Se connecter
          </Button>
          <Button 
            onClick={() => navigate("/register")}
            variant="outline"
            size="lg"
          >
            S'inscrire
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;