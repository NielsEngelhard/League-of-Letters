import { useMessageBar } from '@/components/layout/MessageBarContext';
import { useState } from 'react';

type ServerActionResult<T> = {
  ok: boolean;
  data?: T;
  errorMsg?: string;
};

type UseServerActionOptions = {
  successMessage?: string;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
};

export function useServerAction<T = any>(
  options: UseServerActionOptions = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const globalMessageProvider = useMessageBar();


  const execute = async <TData = T>(
    serverAction: () => Promise<ServerActionResult<TData>>,
    data?: any
  ): Promise<TData | null> => {
    setIsLoading(true);
    
    try {
      const result = await serverAction();
      
      if (result.ok === false) {
        const errorMsg = result.errorMsg || 'An error occurred';
        globalMessageProvider.pushErrorMsg(errorMsg);
        options.onError?.(errorMsg);
        return null;
      }
      
      if (options.successMessage) {
        globalMessageProvider.pushSuccessMsg(options.successMessage);
      }
      
      if (options.onSuccess && result.data) {
        options.onSuccess(result.data);
      }
      
      return result.data || null;
    } catch (error) {
      const errorMsg = 'Server error';
      globalMessageProvider.pushErrorMsg(errorMsg);
      options.onError?.(errorMsg);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    execute,
    isLoading
  };
}