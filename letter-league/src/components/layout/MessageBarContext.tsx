'use client';

import { createContext, useState, ReactNode, useContext } from 'react';

export type GlobalMsgType = "success" | "warning" | "error" | "information" | "loading" | "live-connected";

export interface MessageBarMessage {
  msg?: string;
  type?: GlobalMsgType;
}

type MessageBarContextType = {
  currentMessage: MessageBarMessage | null;
  pushMessage: (msg: MessageBarMessage, durationInSeconds?: number | null) => void;
  clearMessage: () => void;
};

const MessageBarContext = createContext<MessageBarContextType | undefined>(undefined);

export function MessageBarProvider({ children }: { children: ReactNode }) {
  const [currentMessage, setCurrentMessage] = useState<MessageBarMessage | null>(null);

  function pushMessage(msg: MessageBarMessage, durationInSeconds: number | null = 6) {
    if (!msg.type) msg.type = "information";
    setCurrentMessage(msg);

    if (durationInSeconds != null) {
      setTimeout(() => {
        clearMessage();
      }, (durationInSeconds * 1000) + 200);
    }
  }

  function clearMessage() {
    setCurrentMessage(null);
  }

  return (
    <MessageBarContext.Provider value={{ currentMessage, pushMessage, clearMessage }}>
      {children}
    </MessageBarContext.Provider>
  );
}

export function useMessageBar() {
  const context = useContext(MessageBarContext);
  if (context === undefined) {
    throw new Error('useMessageBar must be used within an MessageBarProvider');
  }
  return context;
}
