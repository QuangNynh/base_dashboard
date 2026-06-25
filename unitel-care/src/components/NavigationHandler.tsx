import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import navigationService from '@/lib/navigation';

const NavigationHandler = (): null => {
  const navigate = useNavigate();

  useEffect(() => {
    navigationService.setNavigate(navigate);
  }, [navigate]);

  return null;
};

export default NavigationHandler;
