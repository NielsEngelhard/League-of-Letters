import PageBase from '@/components/layout/PageBase';
import { PICK_GAME_MODE_ROUTE } from '../routes';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <PageBase requiresAuh={false}>
      <div className="text-center space-y-8 flex flex-col items-center justify-center w-full">
        {/* 404 Number */}
        <div className="relative">
          <h1 className="text-8xl font-bold text-gray-200 select-none">404</h1>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">Page Not Found</h2>
          <p className="text-gray-500 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. 
            The page might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {/* <Button size="lg" href={route(PICK_GAME_MODE_ROUTE)}>
                Take me back
            </Button>           */}
        </div>
      </div>
    </PageBase>
  );
}