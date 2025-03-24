
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCircle, LogOut } from "lucide-react";

const Header = () => {
  const location = useLocation();
  
  const getTitleFromPath = (path: string) => {
    switch (path) {
      case '/':
        return 'Dashboard';
      case '/chat':
        return 'Live Chat';
      case '/templates':
        return 'Templates';
      case '/templates/new':
        return 'Create Template';
      case '/integrations':
        return 'Integrations';
      case '/settings':
        return 'Settings';
      default:
        return 'WhatsApp BSP';
    }
  };

  return (
    <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <h1 className="text-xl font-bold">{getTitleFromPath(location.pathname)}</h1>
      
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 rounded-full" size="icon">
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarFallback className="bg-whatsapp-primary/20 text-whatsapp-primary">
                  U
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                <UserCircle className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive cursor-pointer">
              <LogOut className="h-4 w-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
