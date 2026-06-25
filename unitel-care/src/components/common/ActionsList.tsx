import React, { Fragment } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconListDetails } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export type ActionType = 'edit' | 'delete' | 'detail' | 'create' | 'process';

export interface ActionConfig {
  hidden?: boolean;
  disabled?: boolean;
}

interface Props {
  item: ActionType[];
  onAction?: (action: ActionType) => void;
  icon?: React.ReactNode;
  actionConfig?: Partial<Record<ActionType, ActionConfig>>;
}

export function ActionsList({ item, onAction, icon, actionConfig = {} }: Props) {
  const { t } = useTranslation();

  const handleAction = (action: ActionType) => {
    onAction?.(action);
  };

  const allActions = [
    { label: t('common.detail'), action: 'detail' as ActionType },
    { label: t('common.process'), action: 'process' as ActionType },
    {
      label: t('common.delete'),
      action: 'delete' as ActionType,
      variant: 'destructive' as const,
    },
    { label: t('common.create'), action: 'create' as ActionType },
    { label: t('common.edit'), action: 'edit' as ActionType },
  ];

  const actions = allActions.filter((actionItem) => {
    if (!item.includes(actionItem.action)) return false;
    if (actionConfig[actionItem.action]?.hidden) return false;
    return true;
  });

  if (actions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon'>
          {icon ?? <IconListDetails className='h-4 w-4' />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='bottom' align='start' sideOffset={0}>
        {actions.map((actionItem, index) => {
          const isDisabled = actionConfig[actionItem.action]?.disabled ?? false;
          return (
            <Fragment key={actionItem.action}>
              <DropdownMenuItem
                onClick={() => !isDisabled && handleAction(actionItem.action)}
                variant={actionItem.variant}
                disabled={isDisabled}
                className='font-semibold'
              >
                {actionItem.label}
              </DropdownMenuItem>
              {index < actions.length - 1 && <DropdownMenuSeparator />}
            </Fragment>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
