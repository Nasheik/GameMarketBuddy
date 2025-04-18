"use client";

import { Button } from "@/components/ui/button";
import { createCheckoutSession } from "@/app/actions/stripe";

interface PlanSelectionButtonProps {
  priceId: string;
  isPopular?: boolean;
}

export default function PlanSelectionButton({ priceId, isPopular }: PlanSelectionButtonProps) {
  const handlePlanSelection = async () => {
    try {
      const { url } = await createCheckoutSession(priceId);
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.error("Error selecting plan:", error);
    }
  };

  return (
    <Button
      onClick={handlePlanSelection}
      className="w-full"
      variant={isPopular ? "default" : "outline"}
    >
      Select Plan
    </Button>
  );
} 