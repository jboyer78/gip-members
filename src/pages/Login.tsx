import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
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
            Connexion
          </h2>
        </div>

        <LoginForm />

        <div className="text-center">
          <a 
            href="/register" 
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Pas encore inscrit ? Faire une demande d'inscription
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;