import { forwardRef } from 'react';

const Button = forwardRef(
  (
    {
      variant = 'primary',
      size = 'md',
      disabled = false,
      className = '',
      children,
      ...props
    },
    ref,
  ) => {
    const baseStyles =
      'font-semibold transition-all duration-200 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

    const sizeStyles = {
      sm: 'px-3 py-2 text-sm min-h-9 sm:min-h-8',
      md: 'px-4 py-2.5 text-base min-h-12 sm:min-h-10',
      lg: 'px-6 py-3 text-lg min-h-14 sm:min-h-12',
    };

    const variantStyles = {
      primary:
        'bg-gradient-to-r from-red-600 to-red-600 text-white hover:from-red-700 hover:to-red-700 focus-visible:outline-red-500',
      secondary:
        'bg-gradient-to-r from-blue-600 to-blue-600 text-white hover:from-blue-700 hover:to-blue-700 focus-visible:outline-blue-500',
      outline:
        'border-2 border-red-600 text-red-600 hover:bg-red-50 focus-visible:outline-red-500',
      ghost:
        'bg-transparent text-red-600 hover:bg-red-50 focus-visible:outline-red-500',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export default Button;
