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
      'font-semibold transition-all duration-250 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2';

    const sizeStyles = {
      sm: 'px-3.5 py-2 text-sm min-h-9',
      md: 'px-5 py-2.5 text-base min-h-11',
      lg: 'px-7 py-3 text-lg min-h-13',
    };

    const variantStyles = {
      primary:
        'bg-gradient-to-r from-red-600 to-red-600 text-white hover:from-red-700 hover:to-red-700 hover:shadow-lg focus-visible:outline-red-500 shadow-md',
      secondary:
        'bg-gradient-to-r from-blue-600 to-blue-600 text-white hover:from-blue-700 hover:to-blue-700 hover:shadow-lg focus-visible:outline-blue-500 shadow-md',
      accent:
        'bg-gradient-to-r from-purple-600 to-purple-600 text-white hover:from-purple-700 hover:to-purple-700 hover:shadow-lg focus-visible:outline-purple-500 shadow-md',
      outline:
        'border-2 border-red-600 text-red-600 hover:bg-red-50 hover:border-red-700 focus-visible:outline-red-500 transition-colors',
      secondary_outline:
        'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 hover:border-blue-700 focus-visible:outline-blue-500 transition-colors',
      ghost:
        'bg-transparent text-red-600 hover:bg-red-50 focus-visible:outline-red-500 transition-colors',
      secondary_ghost:
        'bg-transparent text-blue-600 hover:bg-blue-50 focus-visible:outline-blue-500 transition-colors',
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
