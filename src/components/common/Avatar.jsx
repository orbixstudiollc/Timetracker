import { clsx } from 'clsx'
import { getInitials } from '../../utils/formatters'

const sizes = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
}

const colors = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-yellow-500',
  'bg-lime-500',
  'bg-green-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-purple-500',
  'bg-fuchsia-500',
  'bg-pink-500',
  'bg-rose-500',
]

function getColorFromName(name) {
  if (!name) return colors[0]
  const charCode = name.charCodeAt(0) + (name.charCodeAt(1) || 0)
  return colors[charCode % colors.length]
}

export function Avatar({
  name,
  src,
  size = 'md',
  className,
  showStatus,
  status,
  ...props
}) {
  const initials = getInitials(name)
  const bgColor = getColorFromName(name)

  return (
    <div className={clsx('relative inline-block', className)} {...props}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={clsx(
            'rounded-full object-cover',
            sizes[size]
          )}
        />
      ) : (
        <div
          className={clsx(
            'rounded-full flex items-center justify-center text-white font-medium',
            sizes[size],
            bgColor
          )}
        >
          {initials}
        </div>
      )}
      {showStatus && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 block rounded-full ring-2 ring-white',
            size === 'xs' && 'w-1.5 h-1.5',
            size === 'sm' && 'w-2 h-2',
            size === 'md' && 'w-2.5 h-2.5',
            size === 'lg' && 'w-3 h-3',
            size === 'xl' && 'w-4 h-4',
            status === 'active' && 'bg-green-500',
            status === 'away' && 'bg-yellow-500',
            status === 'offline' && 'bg-gray-400'
          )}
        />
      )}
    </div>
  )
}

export function AvatarGroup({ children, max = 4, size = 'md' }) {
  const avatars = Array.isArray(children) ? children : [children]
  const visible = avatars.slice(0, max)
  const remaining = avatars.length - max

  return (
    <div className="flex -space-x-2">
      {visible.map((avatar, index) => (
        <div key={index} className="ring-2 ring-white rounded-full">
          {avatar}
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={clsx(
            'rounded-full flex items-center justify-center bg-gray-200 text-gray-600 font-medium ring-2 ring-white',
            sizes[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  )
}
