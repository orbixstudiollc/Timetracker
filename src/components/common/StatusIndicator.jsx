import { clsx } from 'clsx'

const statusColors = {
  active: 'bg-green-500',
  away: 'bg-yellow-500',
  offline: 'bg-gray-400',
  online: 'bg-green-500',
  busy: 'bg-red-500',
}

const sizes = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
}

export function StatusIndicator({
  status,
  size = 'md',
  pulse = false,
  className,
  ...props
}) {
  return (
    <span
      className={clsx(
        'inline-block rounded-full',
        statusColors[status] || 'bg-gray-400',
        sizes[size],
        pulse && status === 'active' && 'animate-pulse',
        className
      )}
      {...props}
    />
  )
}

export function StatusBadge({ status, className }) {
  const labels = {
    active: 'Active',
    away: 'Away',
    offline: 'Offline',
    online: 'Online',
    busy: 'Busy',
  }

  const colors = {
    active: 'bg-green-100 text-green-800',
    away: 'bg-yellow-100 text-yellow-800',
    offline: 'bg-gray-100 text-gray-800',
    online: 'bg-green-100 text-green-800',
    busy: 'bg-red-100 text-red-800',
  }

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium',
        colors[status] || 'bg-gray-100 text-gray-800',
        className
      )}
    >
      <StatusIndicator status={status} size="sm" />
      {labels[status] || status}
    </span>
  )
}
