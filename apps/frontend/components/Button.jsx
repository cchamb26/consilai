export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  ...props 
}) {
  const baseStyles = 'font-semibold rounded-lg transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-400 dark:focus-visible:ring-primary-500 focus-visible:ring-offset-background-light dark:focus-visible:ring-offset-background-dark';
  
  const variants = {
    primary: 'bg-primary-500 dark:bg-primary-600 text-white hover:bg-primary-400 dark:hover:bg-primary-500',
    secondary: 'bg-secondary-400 dark:bg-secondary-500 text-white hover:bg-secondary-300 dark:hover:bg-secondary-400',
    outline: 'border-2 border-primary-400 dark:border-primary-500 text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/50',
    danger: 'bg-rose-600 text-white hover:bg-rose-500',
    success: 'bg-emerald-500 text-white hover:bg-emerald-400',
  };

  const sizes = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

