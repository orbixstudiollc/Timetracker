import { clsx } from 'clsx'

export function Table({ children, className, ...props }) {
  return (
    <div className={clsx('overflow-x-auto', className)}>
      <table className="min-w-full divide-y divide-gray-200" {...props}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children, className, ...props }) {
  return (
    <thead className={clsx('bg-gray-50', className)} {...props}>
      {children}
    </thead>
  )
}

export function TableBody({ children, className, ...props }) {
  return (
    <tbody
      className={clsx('bg-white divide-y divide-gray-200', className)}
      {...props}
    >
      {children}
    </tbody>
  )
}

export function TableRow({ children, className, clickable, ...props }) {
  return (
    <tr
      className={clsx(
        clickable && 'hover:bg-gray-50 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  )
}

export function TableHead({ children, className, ...props }) {
  return (
    <th
      className={clsx(
        'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
        className
      )}
      {...props}
    >
      {children}
    </th>
  )
}

export function TableCell({ children, className, ...props }) {
  return (
    <td
      className={clsx('px-6 py-4 whitespace-nowrap text-sm', className)}
      {...props}
    >
      {children}
    </td>
  )
}
