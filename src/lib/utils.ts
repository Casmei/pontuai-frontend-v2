import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function capitalizeName(name: string): string {
  const lowerWords = ["de", "da", "das", "do", "dos", "e"]

  return name
    .toLowerCase()
    .split(" ")
    .map((word, index) => {
      if (lowerWords.includes(word) && index !== 0) {
        return word
      }
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(" ")
}
