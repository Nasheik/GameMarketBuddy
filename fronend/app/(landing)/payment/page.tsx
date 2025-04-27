import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validatePromoCode } from "@/app/actions/stripe";
import { FormMessage } from "@/components/form-message";

// const plans = [
//   {
//     name: "Basic",
//     price: "$9.99",
//     period: "month",
//     priceId: process.env.STRIPE_BASIC_PRICE_ID!,
//     features: [
//       "Up to 3 games",
//       "Basic analytics",
//       "Email support",
//       "Standard features"
//     ]
//   },
//   {
//     name: "Pro",
//     price: "$29.99",
//     period: "month",
//     priceId: process.env.STRIPE_PRO_PRICE_ID!,
//     features: [
//       "Up to 10 games",
//       "Advanced analytics",
//       "Priority support",
//       "All features"
//     ],
//     popular: true
//   },
//   {
//     name: "Enterprise",
//     price: "$99.99",
//     period: "month",
//     priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID!,
//     features: [
//       "Unlimited games",
//       "Custom analytics",
//       "24/7 support",
//       "Custom features"
//     ]
//   }
// ];

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Enter Promo Code</h1>
          <p className="text-lg text-gray-600">
            Please enter your promo code below
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="bg-white">
            <CardHeader>
              <CardTitle className="text-gray-900">Promo Code</CardTitle>
              <CardDescription className="text-gray-600">
                Enter your promo code to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" action={validatePromoCode}>
                <div className="space-y-2">
                  <Label htmlFor="promoCode" className="text-gray-700">Promo Code</Label>
                  <Input
                    id="promoCode"
                    name="promoCode"
                    placeholder="Enter your promo code"
                    required
                    className="text-gray-900 placeholder:text-gray-500"
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                  Apply Code
                </Button>
                {params.error && (
                  <div className="text-sm text-red-600">
                    {params.error}
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
