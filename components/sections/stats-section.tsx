import type { FC } from "react"

interface StatProps {
  value: string
  label: string
}

const Stat: FC<StatProps> = ({ value, label }) => (
  <div className="flex flex-col items-center justify-center space-y-2 border rounded-lg p-4">
    <div className="text-3xl font-bold">{value}</div>
    <p className="text-center text-sm text-muted-foreground">{label}</p>
  </div>
)

const StatsSection = () => {
  const stats: StatProps[] = [
    { value: "250%", label: "Average increase in wishlists" },
    { value: "10,000+", label: "Games marketed successfully" },
    { value: "85%", label: "Developers report higher sales" },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Trusted by Indie Developers
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Proven Results for Game Developers</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl">
              Join hundreds of indie developers who have transformed their game marketing strategy.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Stat key={index} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsSection

