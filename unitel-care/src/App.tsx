import NavigationHandler from '@/components/NavigationHandler';
import { useRoutes } from 'react-router-dom';
import { routers } from './router';

const App = () => {
  const router = useRoutes(routers);

  return (
    <>
      <NavigationHandler />
      {router}
    </>
  );
};

export default App;
