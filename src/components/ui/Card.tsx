import { ReactNode } from 'react'
import clsx from 'clsx'

export default function Card({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <div className={clsx("p-4 rounded-2xl shadow-soft bg-white dark:bg-gray-900 card-sheen", className)}>
      {children}
    </div>
  )
}
