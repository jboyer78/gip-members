import { QRCodeCanvas } from "qrcode.react";
import { TopNavigation } from "@/components/shared/TopNavigation";
import { AppSidebar } from "@/components/shared/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const QrCodes = () => {
  const websites = [
    {
      title: "Site web GIP",
      url: "https://www.gip-france.org/",
    },
    {
      title: "Site web GIP membres",
      url: "https://gip-members.lovable.app/",
    },
  ];

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-100">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopNavigation />
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-8">
              <h1 className="text-2xl font-bold mb-8">QR Codes des sites web</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {websites.map((site) => (
                  <div
                    key={site.url}
                    className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md"
                  >
                    <h2 className="text-xl font-semibold mb-4">{site.title}</h2>
                    <div className="bg-white p-4 rounded-lg mb-4">
                      <QRCodeCanvas
                        value={site.url}
                        size={200}
                        level="H"
                        includeMargin={true}
                      />
                    </div>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all text-center"
                    >
                      {site.url}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default QrCodes;