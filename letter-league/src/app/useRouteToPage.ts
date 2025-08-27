import { DefaultLanguage } from '@/features/i18n/languages';
import { useParams } from 'next/navigation';

// Used to route to the correct endpoints with the correct [lang] slug in the url - without having to specify the language in each caller
export function useRouteToPage() {
  const params = useParams();
  const currentLang = (params?.lang as string) || DefaultLanguage;
  
  const routeToPage = (route: string): string => {
    // Remove leading slash if present to avoid double slashes
    const cleanRoute = route.startsWith('/') ? route.slice(1) : route;
    return `/${currentLang}/${cleanRoute}`;
  };
  
  return routeToPage;
}