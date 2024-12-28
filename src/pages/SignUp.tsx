import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect } from "react";

const SignUp = () => {
  const { session } = useSessionContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate("/profile");
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8 md:px-0">
      <div className="w-full max-w-md space-y-6 md:space-y-8 p-6 md:p-8 bg-white rounded-xl shadow">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Inscription
          </h2>
        </div>
        <p className="text-center text-gray-600">
          L'inscription n'est pas encore disponible. Veuillez contacter l'administrateur.
        </p>
        <div className="text-center">
          <a 
            href="/login" 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Retour à la connexion
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;