export default function Input({ 
  label, 
  placeholder = '', 
  type = 'text', 
  className = '',
  error = null,
  ...props 
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark placeholder-text-secondary-light dark:placeholder-text-secondary-dark focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all border-border dark:border-slate-700 ${className} ${
          error ? 'border-red-500 focus:ring-red-500' : ''
        }`}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-400 mt-1 block">{error}</span>
      )}
    </div>
  );
}

