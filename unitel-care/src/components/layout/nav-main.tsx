import { ChevronRight } from 'lucide-react';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { useActiveMenu } from '@/hooks/useActiveMenu';
import type { MenuItem } from '@/router/menu';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

const getChildUrls = (items: MenuItem[] = []): (string | undefined)[] =>
  items.flatMap((item) => [item.url, ...getChildUrls(item.items)]);

function NavMainItem({ item }: { item: MenuItem }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isActive, isOpen } = useActiveMenu();
  const childUrls = React.useMemo(() => getChildUrls(item.items), [item.items]);
  const isGroupActive = isOpen(childUrls);
  const [open, setOpen] = React.useState(isGroupActive);

  React.useEffect(() => {
    if (isGroupActive) {
      setOpen(true);
    }
  }, [isGroupActive]);

  if (item.items) {
    return (
      <Collapsible asChild open={open} onOpenChange={setOpen} className='group/collapsible'>
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={t(item.name)}
              className='py-5 data-[active=true]:bg-sidebar-primary data-[active=true]:text-primary cursor-pointer'
              isActive={isActive(item.url)}
            >
              {item.icon && <item.icon className='!w-5 !h-5' />}
              <span className='font-medium '>{t(item.name)}</span>
              <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items.map((subItem) => (
                <SidebarMenuSubItem key={subItem.name}>
                  <SidebarMenuSubButton
                    asChild
                    className='py-4 data-[active=true]:bg-sidebar-primary data-[active=true]:text-primary cursor-pointer'
                    isActive={isActive(subItem.url)}
                    onClick={() => navigate(subItem?.url || '/')}
                  >
                    <span>{t(subItem.name)}</span>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  return (
    <SidebarMenuItem className='py-0'>
      <SidebarMenuButton
        asChild
        onClick={() => navigate(item?.url || '/')}
        className='py-4 data-[active=true]:bg-sidebar-primary data-[active=true]:text-primary cursor-pointer '
        isActive={isActive(item.url)}
      >
        <div className='flex items-center cursor-pointer py-5 font-medium'>
          {item.icon && <item.icon className='!w-5 !h-5' />}
          <span>{t(item.name)}</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function NavMain({ projects }: { projects: MenuItem[] }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {projects.map((item, index) => (
          <NavMainItem key={item.url || item.name || index} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
