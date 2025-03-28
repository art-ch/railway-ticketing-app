import { useState, useEffect } from 'react';

export enum Breakpoint {
  SM = 'sm',
  MD = 'md',
  LG = 'lg',
  XL = 'xl',
  XXL = '2xl'
}

type BreakpointValues = { [key in Breakpoint]: number };

export type BreakpointState = {
  [key in Breakpoint]: boolean;
};

const breakpointValues: BreakpointValues = {
  [Breakpoint.SM]: 640,
  [Breakpoint.MD]: 768,
  [Breakpoint.LG]: 1024,
  [Breakpoint.XL]: 1280,
  [Breakpoint.XXL]: 1536
};

export const useBreakpoint = () => {
  const initialBreakpointState: BreakpointState = {
    [Breakpoint.SM]: false,
    [Breakpoint.MD]: false,
    [Breakpoint.LG]: false,
    [Breakpoint.XL]: false,
    [Breakpoint.XXL]: false
  };

  const [breakpoint, setBreakpoint] = useState<BreakpointState>(
    initialBreakpointState
  );

  useEffect(() => {
    const checkBreakpoint = () => {
      const newBreakpoint: BreakpointState = {} as BreakpointState;

      (Object.keys(breakpointValues) as Breakpoint[]).forEach((key) => {
        newBreakpoint[key] = window.innerWidth >= breakpointValues[key];
      });

      setBreakpoint(newBreakpoint);
    };

    checkBreakpoint();

    window.addEventListener('resize', checkBreakpoint);

    return () => {
      window.removeEventListener('resize', checkBreakpoint);
    };
  }, []);

  return breakpoint;
};
