export default function Textarea({ 
  label, 
  placeholder = '', 
  rows = 4, 
  className = '',
  error = null,
  ...props 
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${className} ${
          error ? 'border-red-500' : ''
        }`}
        {...props}
      />
      {error && (
        <span className="text-sm text-red-600 mt-1 block">{error}</span>
      )}
    </div>
  );
}

