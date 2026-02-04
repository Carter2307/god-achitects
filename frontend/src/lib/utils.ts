import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    ...options,
  })
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function getRoleLabel(role: string): string {
  const labels: Record<string, string> = {
    EMPLOYEE: 'Employé',
    SECRETARY: 'Secrétaire',
    MANAGER: 'Manager',
  }
  return labels[role] || role
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: 'En attente',
    CONFIRMED: 'Confirmé',
    CANCELLED: 'Annulé',
    EXPIRED: 'Expiré',
  }
  return labels[status] || status
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-warning/10 text-warning',
    CONFIRMED: 'bg-success/10 text-success',
    CANCELLED: 'bg-destructive/10 text-destructive',
    EXPIRED: 'bg-muted text-muted-foreground',
  }
  return colors[status] || 'bg-muted text-muted-foreground'
}
