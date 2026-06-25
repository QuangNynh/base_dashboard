import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

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
        <TabsList variant='line' className='py-6 px-3 gap-2'>
          {tabTrigger.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              <span className='px-2 py-0 text-base'>{t(tab.labelKey)}</span>
            </TabsTrigger>
          ))}
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
