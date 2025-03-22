import type { FC } from "react"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

interface PricingTierProps {
  name: string
  description: string
  price: string
  features: string[]
  isPopular?: boolean
}

const PricingTier: FC<PricingTierProps> = ({ name, description, price, features, isPopular = false }) => (
  <div className="flex flex-col overflow-hidden rounded-lg border bg-background relative">
    {isPopular && (
      <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-bl-lg">
        Popular
      </div>
    )}
    <div className="flex flex-col space-y-2 p-6">
      <h3 className="text-xl font-bold">{name}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
      <div className="flex items-baseline">
        <span className="text-3xl font-bold">{price}</span>
        <span className="text-sm font-medium text-muted-foreground">/month</span>
      </div>
    </div>
    <div className="flex flex-col space-y-4 p-6">
      <ul className="space-y-2 text-sm">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="mr-2 h-4 w-4 text-primary" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
    <div className="flex flex-col p-6 mt-auto">
      <Button>Get Started</Button>
    </div>
  </div>
)

const PricingSection = () => {
  const pricingTiers: PricingTierProps[] = [
    {
      name: "Indie Starter",
      description: "Perfect for solo developers",
      price: "$29",
      features: ["Up to 1 game", "Email list up to 5,000 subscribers", "Basic analytics", "Community management tools"],
    },
    {
      name: "Studio Growth",
      description: "For small teams with multiple projects",
      price: "$79",
      features: [
        "Up to 3 games",
        "Email list up to 25,000 subscribers",
        "Advanced analytics",
        "Influencer outreach tools",
        "Priority support",
      ],
      isPopular: true,
    },
    {
      name: "Publisher Pro",
      description: "For established studios and publishers",
      price: "$199",
      features: [
        "Unlimited games",
        "Email list up to 100,000 subscribers",
        "Enterprise analytics",
        "Custom integrations",
        "Dedicated account manager",
      ],
    },
  ]

  return (
    <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">Pricing</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Transparent Pricing</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl">
              Choose the plan that works for your game development journey.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          {pricingTiers.map((tier, index) => (
            <PricingTier key={index} {...tier} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default PricingSection

