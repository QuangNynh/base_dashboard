import * as React from 'react';

import { NavMain } from '@/components/layout/nav-main';
import { Sidebar, SidebarContent, SidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';
import { getMenu } from '@/router/menu';
import { useAuthStore } from '@/store/useAuthStore';
import { Link } from 'react-router-dom';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const isMobile = useIsMobile();
  const { currentUser } = useAuthStore();
  const menu = currentUser?.role ? getMenu(currentUser?.role) : [];

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader className='bg-background'>
        <div className='flex items-center justify-between transition-all duration-200 ease-linear group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-2'>
          <Link to='/' className='flex items-center pl-3 group-data-[collapsible=icon]:hidden'>
            <img
              src='/vite.svg'
              alt='logo'
              className='h-14 w-auto transition-all duration-200 ease-linear group-data-[collapsible=icon]:h-8'
            />
          </Link>
          {!isMobile && (
            <SidebarTrigger className='text-primary transition-all duration-200 ease-linear group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:text-foreground group-data-[collapsible=icon]:hover:text-primary ' />
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className='bg-background'>
        <NavMain projects={menu} />
      </SidebarContent>
    </Sidebar>
  );
}
