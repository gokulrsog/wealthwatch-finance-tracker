import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  gradient?: boolean;
}

const Card = React.memo<CardProps>(({ className, children, hover = false, gradient = false }) => {
  return (
    <div
      className={cn(
        "bg-white rounded-2xl border border-neutral-200/50 shadow-soft",
        hover && "card-hover cursor-pointer",
        gradient && "bg-gradient-to-br from-white to-neutral-50/30",
        className
      )}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

const CardHeader = React.memo<CardHeaderProps>(({ className, children }) => {
  return (
    <div className={cn("p-6 pb-4", className)}>
      {children}
    </div>
  );
});

CardHeader.displayName = 'CardHeader';

interface CardContentProps {
  className?: string;
  children: React.ReactNode;
}

const CardContent = React.memo<CardContentProps>(({ className, children }) => {
  return (
    <div className={cn("px-6 pb-6", className)}>
      {children}
    </div>
  );
});

CardContent.displayName = 'CardContent';

interface CardTitleProps {
  className?: string;
  children: React.ReactNode;
}

const CardTitle = React.memo<CardTitleProps>(({ className, children }) => {
  return (
    <h3 className={cn("text-lg font-semibold text-neutral-900 mb-1", className)}>
      {children}
    </h3>
  );
});

CardTitle.displayName = 'CardTitle';

interface CardDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

const CardDescription = React.memo<CardDescriptionProps>(({ className, children }) => {
  return (
    <p className={cn("text-sm text-neutral-500", className)}>
      {children}
    </p>
  );
});

CardDescription.displayName = 'CardDescription';

export { Card, CardHeader, CardContent, CardTitle, CardDescription };