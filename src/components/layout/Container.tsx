import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type ContainerWidth = 'page' | 'prose' | 'wide' | 'full';

const widthStyles: Record<ContainerWidth, string> = {
  page: 'max-w-page',
  prose: 'max-w-prose',
  wide: 'max-w-wide',
  full: 'max-w-none',
};

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  width?: ContainerWidth;
  as?: 'div' | 'section' | 'header' | 'footer' | 'main' | 'nav';
}

export function Container({
  width = 'page',
  as: Tag = 'div',
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <Tag
      className={cn('mx-auto w-full px-5 sm:px-8 lg:px-12', widthStyles[width], className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
