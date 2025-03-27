import { Dispatch, SetStateAction } from 'react';

export type LayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export type SetState<T> = Dispatch<SetStateAction<T>>;
