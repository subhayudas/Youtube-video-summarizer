import { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface GradientButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  gradientClassName?: string;
}

const GradientButton = forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, gradientClassName, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          'relative overflow-hidden bg-primary/10',
          'hover:bg-primary/20 transition-colors',
          'border-0',
          className
        )}
        {...props}
      >
        <motion.div
          className={cn(
            'absolute inset-0 bg-gradient-to-r from-primary/50 to-primary/30',
            'opacity-0 hover:opacity-100 transition-opacity duration-300',
            gradientClassName
          )}
        />
        <span className="relative z-10">{children}</span>
      </Button>
    );
  }
);

GradientButton.displayName = 'GradientButton';

export default GradientButton;