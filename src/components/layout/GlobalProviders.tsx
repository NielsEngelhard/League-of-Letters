'use client';

type Props = {
    children: React.ReactNode;
}


export function Providers({ children }: Props) {
  return (
      <div>
        {children}
      </div>
  );
}