import type { LucideIcon } from "lucide-react"

export interface NavItem {
  title: string
  href: string
}

export interface FeatureItem {
  icon: LucideIcon
  title: string
  description: string
}

export interface PricingTier {
  name: string
  description: string
  price: string
  features: string[]
  isPopular?: boolean
}

export interface Testimonial {
  quote: string
  author: string
  company: string
  rating: number
}

export interface Stat {
  value: string
  label: string
}

