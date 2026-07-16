'use client'

import Link from 'next/link'
import { FiAlertCircle } from 'react-icons/fi'

export function AdminLoading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <span className="loading loading-spinner loading-lg text-[#FF9900]" />
      <p className="text-sm text-[#565959]">{label}</p>
    </div>
  )
}

export function AdminAlert({
  children,
  variant = 'error',
}: {
  children: React.ReactNode
  variant?: 'error' | 'info'
}) {
  const styles =
    variant === 'error'
      ? 'bg-[#FFF4F4] border-[#F5C6C6] text-[#B12704]'
      : 'bg-[#F7FBFF] border-[#B8D4E8] text-[#0F1111]'
  return (
    <div className={`flex items-start gap-3 border rounded-sm px-4 py-3 text-sm ${styles}`}>
      <FiAlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  )
}

export function AdminPanel({
  children,
  className = '',
  noPadding,
}: {
  children: React.ReactNode
  className?: string
  noPadding?: boolean
}) {
  return (
    <div
      className={`admin-panel ${noPadding ? '' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

export function AdminPanelHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
}) {
  return (
    <div className="admin-panel-header flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div>
        <h2 className="text-base font-bold text-[#0F1111]">{title}</h2>
        {subtitle && <p className="text-xs text-[#565959] mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

export function AdminStatGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{children}</div>
}

export function AdminStatCard({
  label,
  value,
  icon,
  accent = 'neutral',
  onClick,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
  accent?: 'neutral' | 'success' | 'warning' | 'danger' | 'brand'
  onClick?: () => void
}) {
  const accentMap = {
    neutral: 'text-[#565959]',
    success: 'text-[#007600]',
    warning: 'text-[#FF9900]',
    danger: 'text-[#B12704]',
    brand: 'text-[#007185]',
  }
  const Tag = onClick ? 'button' : 'div'
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`admin-stat text-left w-full ${onClick ? 'hover:border-[#AAAAAA] cursor-pointer transition-colors' : ''}`}
    >
      <div className={`flex items-center gap-2 text-xs font-medium ${accentMap[accent]}`}>
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-2xl font-bold text-[#0F1111] mt-2">{value}</p>
    </Tag>
  )
}

export function AdminToolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-panel p-4 flex flex-col sm:flex-row gap-3">{children}</div>
  )
}

export function AdminSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="amazon-input flex-1"
    />
  )
}

export function AdminFilterChips<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`px-3 py-1.5 rounded-sm text-xs font-medium border transition-colors ${
            value === opt.id
              ? 'bg-[#232F3E] text-white border-[#232F3E]'
              : 'bg-white text-[#0F1111] border-[#D5D9D9] hover:border-[#AAAAAA]'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export function AdminTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-panel overflow-hidden">
      <div className="overflow-x-auto">
        <table className="admin-table">{children}</table>
      </div>
    </div>
  )
}

export function AdminTableFoot({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-4 py-3 border-t border-[#D5D9D9] text-xs text-[#565959] bg-[#F7F8F8]">
      {children}
    </div>
  )
}

export function AdminBadge({
  children,
  variant = 'neutral',
}: {
  children: React.ReactNode
  variant?: 'neutral' | 'success' | 'error' | 'featured'
}) {
  const cls = {
    neutral: 'admin-badge-neutral',
    success: 'admin-badge-success',
    error: 'admin-badge-error',
    featured: 'bg-[#FF9900]/15 text-[#0F1111] px-2 py-0.5 rounded text-xs font-bold',
  }[variant]
  return <span className={cls}>{children}</span>
}

export function AdminBtnPrimary({
  children,
  href,
  onClick,
  disabled,
  className = '',
}: {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  disabled?: boolean
  className?: string
}) {
  const cls = `btn-amazon inline-flex items-center justify-center gap-2 rounded-md ${className}`
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  )
}

export function AdminBtnOutline({
  children,
  href,
  onClick,
  type = 'button',
  disabled,
  className = '',
}: {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  type?: 'button' | 'submit'
  disabled?: boolean
  className?: string
}) {
  const cls = `btn-amazon-outline inline-flex items-center justify-center gap-2 rounded-md ${className}`
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    )
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={cls}>
      {children}
    </button>
  )
}

export function AdminLinkAction({
  children,
  href,
  onClick,
  danger,
}: {
  children: React.ReactNode
  href?: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  danger?: boolean
}) {
  const cls = `admin-btn-link inline-flex items-center gap-1 ${danger ? '!text-[#CC0C39]' : ''}`
  if (href) {
    return (
      <Link href={href} className={cls} onClick={(e) => e.stopPropagation()}>
        {children}
      </Link>
    )
  }
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick?.(e)
      }}
      className={cls}
    >
      {children}
    </button>
  )
}

export function AdminFormSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="admin-panel p-5 space-y-4">
      <h2 className="text-sm font-bold text-[#565959] uppercase tracking-wider border-b border-[#D5D9D9] pb-2">
        {title}
      </h2>
      {children}
    </div>
  )
}

export function AdminField({
  label,
  htmlFor,
  children,
  error,
}: {
  label: string
  htmlFor?: string
  children: React.ReactNode
  error?: string
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-[#0F1111] mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-[#B12704] mt-1">{error}</p>}
    </div>
  )
}
