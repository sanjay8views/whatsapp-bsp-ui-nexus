
import { Home, MessageSquare, FileText, Plus, UserCircle, Webhook } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: Home,
  },
  {
    title: "Live Chat",
    path: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Templates",
    path: "/templates",
    icon: FileText,
  },
  {
    title: "New Template",
    path: "/templates/new",
    icon: Plus,
  },
  {
    title: "Integrations",
    path: "/integrations",
    icon: Webhook,
  },
];

const Navigation = () => {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="px-4 py-2">
            <Link to="/">
              <img 
                src="https://media.scaledino.com/website/images/assets/images/global/scale-dino-logo.webp" 
                alt="Scale Dino Logo" 
                className="h-10 w-auto"
              />
            </Link>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton
                    asChild
                    className={location.pathname === item.path ? "bg-whatsapp-primary/10" : ""}
                  >
                    <Link to={item.path} className="flex items-center gap-2">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default Navigation;
