import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Merges and deduplicates Tailwind CSS class names
export function mergeClassNameUtilities(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
