import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

interface TabItem {
  value: string;
  labelKey: string;
  component: React.ReactNode;
}

interface Props {
  tabTrigger: TabItem[];
}

const TabListCustom = ({ tabTrigger }: Props) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentTab = searchParams.get('tab') ?? tabTrigger[0]?.value ?? '';

  // Lazy mount: render tab content only when first visited, then keep mounted to preserve state
  const [mountedTabs, setMountedTabs] = useState<Set<string>>(() => {
    const tab = new URLSearchParams(window.location.search).get('tab');
    const isValid = tabTrigger.some((item) => item.value === tab);
    const initial = isValid && tab ? tab : tabTrigger[0]?.value;
    return initial ? new Set([initial]) : new Set();
  });

  const isFirstRender = useRef(true);
  const tabsListRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  // Set default tab in URL only when tabTrigger config changes — avoids searchParams in deps
  useEffect(() => {
    if (!tabTrigger.length) return;
    const tab = new URLSearchParams(window.location.search).get('tab');
    const isValid = tabTrigger.some((item) => item.value === tab);
    if (!tab || !isValid) {
      const params = new URLSearchParams(window.location.search);
      params.set('tab', tabTrigger[0].value);
      setSearchParams(params, { replace: true });
    }
  }, [tabTrigger, setSearchParams]);

  // Update active tab indicator position and width dynamically
  useEffect(() => {
    const tabsList = tabsListRef.current;
    if (!tabsList) return;

    const updateIndicator = (isInitial = false) => {
      const activeTrigger = tabsList.querySelector('[data-state="active"]') as HTMLElement;
      if (activeTrigger) {
        const lineTop = activeTrigger.offsetTop + activeTrigger.offsetHeight + 5;
        setIndicatorStyle({
          left: `${activeTrigger.offsetLeft}px`,
          width: `${activeTrigger.offsetWidth}px`,
          top: `${lineTop}px`,
          opacity: 1,
          transition: isInitial ? 'none' : undefined,
        });
      } else {
        setIndicatorStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    // Run initially
    updateIndicator(isFirstRender.current);
    if (isFirstRender.current) {
      isFirstRender.current = false;
    }

    // Observe size changes of container and child tab triggers
    const resizeObserver = new ResizeObserver(() => {
      updateIndicator();
    });
    resizeObserver.observe(tabsList);

    const children = tabsList.querySelectorAll('[data-slot="tabs-trigger"]');
    children.forEach((child) => resizeObserver.observe(child));

    return () => {
      resizeObserver.disconnect();
    };
  }, [currentTab, tabTrigger]);

  const handleTabChange = (value: string) => {
    // Add to mountedTabs synchronously with URL update (React 18 batches both)
    setMountedTabs((prev) => (prev.has(value) ? prev : new Set([...prev, value])));
    const params = new URLSearchParams(searchParams);
    params.set('tab', value);
    // replace: true prevents history stack pollution on every tab switch
    setSearchParams(params, { replace: true });
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <div className='bg-card pt-1 rounded-md'>
        <TabsList variant='line' ref={tabsListRef} className='relative py-6 px-3 gap-2'>
          {tabTrigger.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className='after:hidden'>
              <span className='px-2 py-0 text-base'>{t(tab.labelKey)}</span>
            </TabsTrigger>
          ))}
          <div
            className='absolute h-0.5 bg-primary transition-all duration-300 ease-out pointer-events-none'
            style={indicatorStyle}
          />
        </TabsList>
      </div>

      {tabTrigger.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {mountedTabs.has(tab.value) ? tab.component : null}
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default TabListCustom;
