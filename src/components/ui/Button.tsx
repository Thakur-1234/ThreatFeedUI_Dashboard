import clsx from 'clsx'

export default function Button({ children, onClick, variant="primary" }: 
  { children: React.ReactNode, onClick?: () => void, variant?: "primary" | "ghost" }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "px-4 py-2 rounded-xl font-medium transition",
        variant === "primary" && "bg-brand-500 hover:bg-brand-600 text-white",
        variant === "ghost" && "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800"
      )}
    >
      {children}
    </button>
  )
}
