import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createCheckoutSession } from "@/app/actions/stripe";
import PlanSelectionButton from "@/app/components/PlanSelectionButton";

const plans = [
  {
    name: "Basic",
    price: "$9.99",
    period: "month",
    priceId: process.env.STRIPE_BASIC_PRICE_ID!,
    features: [
      "Up to 3 games",
      "Basic analytics",
      "Email support",
      "Standard features"
    ]
  },
  {
    name: "Pro",
    price: "$29.99",
    period: "month",
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
    features: [
      "Up to 10 games",
      "Advanced analytics",
      "Priority support",
      "All features"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "$99.99",
    period: "month",
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
    features: [
      "Unlimited games",
      "Custom analytics",
      "24/7 support",
      "Custom features"
    ]
  }
];

export default async function PaymentPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-lg text-muted-foreground">
          Select the perfect plan for your game marketing needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`relative ${
              plan.popular ? "border-primary shadow-lg" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm">
                  Most Popular
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-3xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">/{plan.period}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg
                      className="h-5 w-5 text-primary mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <PlanSelectionButton 
                priceId={plan.priceId} 
                isPopular={plan.popular} 
              />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
