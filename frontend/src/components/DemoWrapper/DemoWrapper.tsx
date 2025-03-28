import { useBreakpoint } from '@/hooks/useBreakpoint/useBreakpoint';
import { useEffect, useState } from 'react';

export type DemoWrapperProps = {
  children: React.ReactNode;
};

export const DemoWrapper = ({ children }: DemoWrapperProps) => {
  const breakPoint = useBreakpoint();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  if (breakPoint.xl) {
    return <>{children}</>;
  }

  return <div>This demo is intended to be shown on desktop</div>;
};
