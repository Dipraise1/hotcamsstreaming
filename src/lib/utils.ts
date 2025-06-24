import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatWalletAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function formatTokenAmount(amount: number, decimals: number = 6): string {
  return (amount / Math.pow(10, decimals)).toFixed(4)
} 