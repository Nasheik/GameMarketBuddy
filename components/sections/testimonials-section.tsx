import type { FC } from "react"

interface TestimonialProps {
  quote: string
  author: string
  company: string
}

const Testimonial: FC<TestimonialProps> = ({ quote, author, company }) => (
  <div className="flex flex-col justify-between space-y-4 rounded-lg border p-6">
    <div className="space-y-2">
      <div className="flex space-x-0.5">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5 text-yellow-400"
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clipRule="evenodd"
            />
          </svg>
        ))}
      </div>
      <p className="text-muted-foreground">{quote}</p>
    </div>
    <div className="flex items-center space-x-4">
      <div className="rounded-full bg-muted h-10 w-10"></div>
      <div>
        <p className="text-sm font-medium">{author}</p>
        <p className="text-xs text-muted-foreground">{company}</p>
      </div>
    </div>
  </div>
)

const TestimonialsSection = () => {
  const testimonials: TestimonialProps[] = [
    {
      quote:
        "GameBoost transformed our marketing strategy. We saw a 300% increase in wishlists within the first month!",
      author: "Sarah Johnson",
      company: "Pixel Dreams Studio",
    },
    {
      quote:
        "The email campaign tools helped us build a loyal community before we even launched. Best investment we made.",
      author: "Michael Chen",
      company: "Neon Arcade Games",
    },
    {
      quote:
        "Their analytics helped us understand our audience better. We completely changed our marketing approach and it paid off.",
      author: "Emma Rodriguez",
      company: "Cosmic Play Interactive",
    },
  ]

  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
              Testimonials
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Loved by Game Developers</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl">
              See what other indie developers are saying about GameBoost.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Testimonial key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection

