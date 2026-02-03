import { Play, Pause, Square } from 'lucide-react'
import { clsx } from 'clsx'
import { formatDuration } from '../../utils/formatters'

export function Timer({
  seconds,
  isRunning,
  onStart,
  onPause,
  onStop,
  size = 'md',
  showControls = true,
  className,
}) {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  }

  const buttonSizes = {
    sm: 'p-1',
    md: 'p-2',
    lg: 'p-3',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  return (
    <div className={clsx('flex items-center gap-3', className)}>
      <span
        className={clsx(
          'font-mono font-semibold tabular-nums',
          sizes[size],
          isRunning ? 'text-primary-600' : 'text-gray-900'
        )}
      >
        {formatDuration(seconds)}
      </span>

      {showControls && (
        <div className="flex items-center gap-1">
          {isRunning ? (
            <button
              onClick={onPause}
              className={clsx(
                'rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors',
                buttonSizes[size]
              )}
            >
              <Pause className={iconSizes[size]} />
            </button>
          ) : (
            <button
              onClick={onStart}
              className={clsx(
                'rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors',
                buttonSizes[size]
              )}
            >
              <Play className={iconSizes[size]} />
            </button>
          )}
          {(isRunning || seconds > 0) && onStop && (
            <button
              onClick={onStop}
              className={clsx(
                'rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors',
                buttonSizes[size]
              )}
            >
              <Square className={iconSizes[size]} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export function TimerDisplay({ seconds, className }) {
  return (
    <span
      className={clsx(
        'font-mono font-semibold tabular-nums text-2xl text-primary-600',
        className
      )}
    >
      {formatDuration(seconds)}
    </span>
  )
}
