import * as React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import {
  Bike,
  LayoutDashboard,
  Users,
  Building,
  Store,
  Truck,
  LogOut,
  Wrench,
} from "lucide-react";
import { appRoutes } from "@/navigation/routes";

// Map des icônes en fonction des noms
const iconMap: { [key: string]: React.ElementType } = {
  LayoutDashboard: LayoutDashboard,
  Users: Users,
  Building: Building,
  Store: Store,
  Truck: Truck,
  Wrench: Wrench,
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const { user, logout } = useAuth();

  // Filtrer les routes du sidebar :
  // - On affiche uniquement celles qui possèdent une icône (pour le menu)
  // - Et pour lesquelles l'utilisateur possède l'accès
  const filteredRoutes = appRoutes.filter(
    (route) =>
      route.icon &&
      user?.role &&
      route.allowedRoles.includes(user.role)
  );

  // Fonction pour obtenir le composant icône
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className="h-4 w-4" /> : null;
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center space-x-2">
          <Bike className="h-6 w-6" />
          <span className="text-lg font-bold">Triumph Management</span>
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {user?.firstName} {user?.lastName}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredRoutes.map((route) => (
                <SidebarMenuItem key={route.path}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === route.path}
                  >
                    <Link to={route.path} className="flex items-center gap-2">
                      {getIcon(route.icon!)}
                      <span>{route.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={logout}
                  className="w-full text-red-500 hover:text-red-600"
                >
                  <div className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    <span>Se déconnecter</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
