import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageview } from '../utils/analytics';

export const useAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Sayfa değiştiğinde Google Analytics'e bildir
    pageview(location.pathname + location.search);
  }, [location]);
}; 