import { IconDeviceLaptop, IconGridDots, IconLayoutGrid, IconSparkles } from "@tabler/icons-react"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const backgroundCounts = {
  desktop: 69,
  gradient: 90,
  minimal: 65,
  pattern: 49,
} as const

export type BackgroundCategory = keyof typeof backgroundCounts

export type Background = {
  name: string
  category: BackgroundCategory
  backgroundUrl: string
  previewUrl: string
}

function formatBackgroundName(category: BackgroundCategory, index: number) {
  const label = category.charAt(0).toUpperCase() + category.slice(1)
  return `${label} ${String(index).padStart(2, "0")}`
}

export const backgrounds: Background[] = Object.entries(backgroundCounts).flatMap(
  ([category, count]) =>
    Array.from({ length: count }, (_, index) => {
      const backgroundCategory = category as BackgroundCategory
      const itemNumber = String(index + 1).padStart(2, "0")
      const path = `/images/backgrounds/${backgroundCategory}/${backgroundCategory}-${itemNumber}`

      return {
        name: formatBackgroundName(backgroundCategory, index + 1),
        category: backgroundCategory,
        backgroundUrl: `${path}.jpg`,
        previewUrl: `${path}.avif`,
      }
    }),
)


export const categories = [
  {
    id: "desktop",
    label: "Desktop",
    icon: IconDeviceLaptop,
    count: 69,
  },
  {
    id: "gradient",
    label: "Gradients",
    icon: IconSparkles,
    count: 90,
  },
  {
    id: "minimal",
    label: "Minimal",
    icon: IconLayoutGrid,
    count: 65,
  },
  {
    id: "pattern",
    label: "Patterns",
    icon: IconGridDots,
    count: 49,
  },
];