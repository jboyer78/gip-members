import { QRCodeCanvas } from "qrcode.react";
import { TopNavigation } from "@/components/shared/TopNavigation";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

const QrCodes = () => {
  const websites = [
    {
      name: "Site web GIP membres",
      url: "https://gip-members.lovable.app",
    },
    {
      name: "Site web GIP",
      url: "https://www.gip-france.org",
    },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full flex-col md:flex-row bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <AppSidebar />
        
        <main className="flex-1 p-4 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-4 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="p-2 hover:bg-gray-100/80 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">QR Codes</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Codes QR des différents sites web</p>
              </div>
            </div>
            <TopNavigation />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {websites.map((site) => (
              <div
                key={site.url}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 rounded-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
              >
                <h2 className="text-xl font-semibold mb-4 text-center">{site.name}</h2>
                <div className="flex flex-col items-center gap-4">
                  <QRCodeCanvas
                    value={site.url}
                    size={200}
                    bgColor={"#ffffff"}
                    fgColor={"#000000"}
                    level={"L"}
                    includeMargin={false}
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400 break-all text-center">
                    {site.url}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default QrCodes;