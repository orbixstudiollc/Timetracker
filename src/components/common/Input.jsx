import { clsx } from 'clsx'

export function Input({
  type = 'text',
  className,
  error,
  ...props
}) {
  return (
    <input
      type={type}
      className={clsx(
        'w-full px-3 py-2 border rounded-lg',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
        'disabled:bg-gray-100 disabled:cursor-not-allowed',
        error ? 'border-red-300' : 'border-gray-300',
        className
      )}
      {...props}
    />
  )
}

export function FormInput({ label, error, required, ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Input error={error} {...props} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export function Textarea({ className, error, rows = 3, ...props }) {
  return (
    <textarea
      rows={rows}
      className={clsx(
        'w-full px-3 py-2 border rounded-lg resize-none',
        'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
        'disabled:bg-gray-100 disabled:cursor-not-allowed',
        error ? 'border-red-300' : 'border-gray-300',
        className
      )}
      {...props}
    />
  )
}

export function FormTextarea({ label, error, required, ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <Textarea error={error} {...props} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export function Checkbox({ label, className, ...props }) {
  return (
    <label className={clsx('flex items-center gap-2 cursor-pointer', className)}>
      <input
        type="checkbox"
        className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        {...props}
      />
      {label && <span className="text-sm text-gray-700">{label}</span>}
    </label>
  )
}
