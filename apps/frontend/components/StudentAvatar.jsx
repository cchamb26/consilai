export default function StudentAvatar({ 
  name = 'Student', 
  avatar = '👤',
  size = 'md',
  className = ''
}) {
  const sizes = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-12 h-12 text-2xl',
    lg: 'w-16 h-16 text-4xl',
  };

  return (
    <div
      className={`
        flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-blue-500 to-cyan-400
        text-white font-semibold shadow-lg shadow-indigo-900/50
        ${sizes[size]}
        ${className}
      `}
      title={name}
    >
      {avatar}
    </div>
  );
}

