import { SidebarProvider, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenuItem, SidebarMenuButton, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, ListPlus, Bell } from "lucide-react";

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
      <div className="min-h-screen flex w-full flex-col md:flex-row bg-gray-50">
        <Sidebar variant="floating" className="w-full md:w-64 shrink-0">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/profile" className="flex items-center space-x-2 p-2 md:p-3">
                      <User className="h-4 w-4 md:h-5 md:w-5" />
                      <span className="text-sm md:text-base">Profil</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/annonces" className="flex items-center space-x-2 p-2 md:p-3">
                      <ListPlus className="h-4 w-4 md:h-5 md:w-5" />
                      <span className="text-sm md:text-base">Annonces</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        
        <main className="flex-1 p-4 md:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Tableau de bord</h1>
                <p className="text-sm text-gray-600">Bienvenue sur votre espace personnel</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">JD</span>
              </div>
            </div>
          </div>

          {/* Blog Post Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={`https://images.unsplash.com/${post.image}?auto=format&fit=crop&w=800&q=80`}
                    alt={post.title}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.excerpt}</p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{post.author}</span>
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