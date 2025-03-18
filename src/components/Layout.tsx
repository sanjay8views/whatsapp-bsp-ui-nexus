
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import Navigation from './Navigation';

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="main-layout">
        <Navigation />
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
