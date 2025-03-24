
import React from 'react';
import { Outlet } from 'react-router-dom';
import { SidebarProvider } from "@/components/ui/sidebar";
import Navigation from './Navigation';
import Header from './Header';

const Layout = () => {
  return (
    <SidebarProvider>
      <div className="main-layout flex h-screen">
        <Navigation />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="main-content flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
