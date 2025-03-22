
import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/ui/button';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  icon?: React.ReactNode;
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = ({
  children,
  className,
  variant = 'default',
  size = 'default',
  icon,
  isLoading,
  ...props
}: ButtonProps) => {
  return (
    <ShadcnButton
      className={cn({
        'gap-2': icon || isLoading,
        [className || '']: !!className
      })}
      variant={variant}
      size={size}
      {...props}
    >
      {icon && !isLoading && icon}
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </ShadcnButton>
  );
};
