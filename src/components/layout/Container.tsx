import type { ReactNode } from 'react';
import clsx from 'clsx';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className }: ContainerProps) {
  return (
    <div className={clsx('mx-auto max-w-[1400px] px-[clamp(20px,4vw,80px)]', className)}>
      {children}
    </div>
  );
}
