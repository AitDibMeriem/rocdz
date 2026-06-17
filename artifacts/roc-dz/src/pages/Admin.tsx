import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { AdminSidebar, AdminSection } from "@/components/admin/AdminSidebar";
import { DashboardSection } from "@/components/admin/DashboardSection";
import { LaptopsSection } from "@/components/admin/LaptopsSection";
import { AccessoriesSection } from "@/components/admin/AccessoriesSection";
import { SettingsSection } from "@/components/admin/SettingsSection";
import { PromoCodesSection } from "@/components/admin/PromoCodesSection";
import { OrdersSection } from "@/components/admin/OrdersSection";
import { PlaceholderSection } from "@/components/admin/PlaceholderSection";

export default function Admin() {
  const [activeSection, setActiveSection] = useState<AdminSection>("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard": return <DashboardSection />;
      case "laptops": return <LaptopsSection />;
      case "accessories": return <AccessoriesSection />;
      case "orders": return <OrdersSection />;
      case "promo": return <PromoCodesSection />;
      case "reports": return <PlaceholderSection title="Reports" icon={BarChart3} />;
      case "settings": return <SettingsSection />;
      default: return <DashboardSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      <AdminSidebar activeSection={activeSection} onChangeSection={setActiveSection} />
      <main className="flex-1 w-full md:pl-[260px] pt-16 md:pt-0">
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
          {renderSection()}
        </div>
      </main>
    </div>
  );
}
