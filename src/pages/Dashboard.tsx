import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, ListPlus, Bell } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Comment créer un site web moderne",
      excerpt: "Guide complet pour développer un site web responsive et performant",
      date: "Il y a 2 jours",
      image: "photo-1488590528505-98d2b5aba04b",
      author: "Julie Martin"
    },
    {
      id: 2,
      title: "Les meilleures pratiques React en 2024",
      excerpt: "Découvrez les dernières tendances et techniques en React",
      date: "Il y a 4 jours",
      image: "photo-1461749280684-dccba630e2f6",
      author: "Thomas Dubois"
    },
    {
      id: 3,
      title: "L'importance du design responsive",
      excerpt: "Pourquoi et comment adapter votre site à tous les écrans",
      date: "Il y a 1 semaine",
      image: "photo-1581091226825-a6a2a5aee158",
      author: "Sophie Bernard"
    }
  ];

  return (
    <SidebarProvider defaultOpen={false}>
      <div className="min-h-screen flex w-full flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Sidebar variant="floating" className="w-full md:w-64 shrink-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-r border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <SidebarContent>
            {/* Logo GIP avec plus d'espace en bas */}
            <div className="flex justify-center p-4 mb-12">
              <img 
                src="/lovable-uploads/e17e4ca6-2674-4aa6-999e-4b76b7ae8f32.png" 
                alt="Logo GIP" 
                className="w-32 h-32"
              />
            </div>
            
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenuItem className="list-none mb-4">
                  <SidebarMenuButton asChild>
                    <a href="/profile" className="flex items-center space-x-4 p-4 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300 group">
                      <User className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-300" />
                      <span className="text-lg font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors duration-300">Profil</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem className="list-none">
                  <SidebarMenuButton asChild>
                    <a href="/annonces" className="flex items-center space-x-4 p-4 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300 group">
                      <ListPlus className="h-6 w-6 text-gray-600 dark:text-gray-400 group-hover:text-primary transition-colors duration-300" />
                      <span className="text-lg font-medium text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors duration-300">Annonces</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <main className="flex-1 p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="p-2 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">Tableau de bord</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Bienvenue sur votre espace personnel</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-full transition-all duration-300">
                <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <Link 
                to="/profile" 
                className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg shadow-primary/20 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <span className="text-white text-sm font-medium">JD</span>
              </Link>
            </div>
          </div>

          {/* Blog Post Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Card key={post.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-gray-200/50 dark:border-gray-700/50">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/${post.image}?auto=format&fit=crop&w=800&q=80`}
                    alt={post.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors duration-200">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{post.excerpt}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <span className="font-medium">{post.author}</span>
                    <span>{post.date}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;