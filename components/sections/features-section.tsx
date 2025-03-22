import type { FC } from "react"
import { Target, Mail, BarChart3, MessageSquare, Rocket, Zap, type LucideIcon } from "lucide-react"

interface FeatureProps {
  icon: LucideIcon
  title: string
  description: string
}

const Feature: FC<FeatureProps> = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-start space-y-4 border rounded-lg p-6">
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
      <Icon className="h-6 w-6 text-primary" />
    </div>
    <div className="space-y-2">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  </div>
)

const FeaturesSection = () => {
  const features: FeatureProps[] = [
    {
      icon: Target,
      title: "Audience Targeting",
      description: "Find and reach gamers who will love your specific game genre and style.",
    },
    {
      icon: Mail,
      title: "Email Campaigns",
      description: "Build and nurture your player community with automated email sequences.",
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Track performance metrics and optimize your marketing strategy in real-time.",
    },
    {
      icon: MessageSquare,
      title: "Community Management",
      description: "Engage with your players across Discord, Steam, and social media from one place.",
    },
    {
      icon: Rocket,
      title: "Launch Campaigns",
      description: "Create buzz around your game launch with coordinated marketing campaigns.",
    },
    {
      icon: Zap,
      title: "Influencer Outreach",
      description: "Connect with relevant streamers and content creators who match your game.",
    },
  ]

  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Market Your Game</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl">
              Powerful tools designed specifically for indie game developers.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection

