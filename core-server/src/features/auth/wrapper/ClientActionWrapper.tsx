"use client";

import { useMessageBar } from '@/components/layout/MessageBarContext';
import { useState } from 'react';

export function useActionWrapper<T>() {
  const [loading, setLoading] = useState(false);
  const globalMessage = useMessageBar();

  const executeAction = async <A extends (...args: any[]) => Promise<T>>(
    action: A,
    ...args: Parameters<A>
  ): Promise<T | { success: boolean; error: string }> => {
    setLoading(true);
    globalMessage.clearMessage();

    try {
      const result = await action(...args);
      return result;
    } catch (error) {
      // The server-side 'withAuth' wrapper will handle the redirect on auth errors.
      // This catch block handles unexpected client-side or network errors.
      console.error("Client-side action error:", error);
      globalMessage.pushErrorMsg("Unexpected error");
      return { success: false, error: "An unexpected error occurred." };
    } finally {
      setLoading(false);
    }
  };

  return { loading, executeAction };
}
