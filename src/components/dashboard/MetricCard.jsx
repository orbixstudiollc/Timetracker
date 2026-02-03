import { clsx } from 'clsx'

export function MetricCard({ title, value, subtitle, icon: Icon, trend, trendUp, className }) {
  return (
    <div className={clsx('bg-white rounded-xl shadow-sm border border-gray-200 p-6', className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <p className={clsx(
              'mt-2 text-sm font-medium',
              trendUp ? 'text-green-600' : 'text-red-600'
            )}>
              {trendUp ? '↑' : '↓'} {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-primary-50 rounded-lg">
            <Icon className="w-8 h-8 text-primary-600" />
          </div>
        )}
      </div>
    </div>
  )
}
