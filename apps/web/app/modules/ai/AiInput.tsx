import { Input, type InputProps } from '@rekipe/ui/input';
import { cn } from '@rekipe/ui/utils';

export function AiInput({ className, ...props }: InputProps) {
  return (
    <Input
      className={cn('px-4 py-5', className)}
      placeholder='Ask me about a recipe...'
      {...props}
    />
  );
}
