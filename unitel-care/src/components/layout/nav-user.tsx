import { IconLogout } from '@tabler/icons-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/useAuthStore';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/button';

export function NavUser() {
  const { t } = useTranslation();
  const { currentUser, logout } = useAuthStore();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    queryClient.clear();
    logout();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className='flex justify-center items-center gap-2'>
          <div>
            <span className='text-muted-foreground'>{t('common.hello')}, </span>
            <span>{currentUser?.fullName}</span>
          </div>
          <Button
            variant='ghost'
            role='button'
            className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground p-2'
          >
            <Avatar className='h-8 w-8 rounded-full grayscale'>
              <AvatarImage src={undefined} alt={currentUser?.fullName} />
              <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
            </Avatar>
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
        side={'bottom'}
        align='end'
        sideOffset={4}
      >
        <DropdownMenuLabel className='p-0 font-normal'>
          <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
            <Avatar className='h-8 w-8 rounded-lg'>
              <AvatarImage src={undefined} alt={currentUser?.fullName} />
              <AvatarFallback className='rounded-lg'>CN</AvatarFallback>
            </Avatar>
            <div className='grid flex-1 text-left text-sm leading-tight'>
              <span className='truncate font-medium'>{currentUser?.fullName}</span>
              <span className='text-muted-foreground truncate text-xs'>{currentUser?.email}</span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <IconLogout />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
