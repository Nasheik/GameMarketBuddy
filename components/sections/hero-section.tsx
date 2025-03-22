"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HeroSection = () => {
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setEmail("");
    }, 1000);
  };

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Supercharge Your Indie Game Marketing
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                The all-in-one platform designed to help indie game developers
                reach more players, build communities, and boost sales without
                the marketing headache.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <div className="flex-1">
                <form
                  id="signup"
                  className="flex w-full max-w-sm items-center space-x-2"
                  onSubmit={handleSubmit}
                >
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isSubmitting || isSubmitted}
                  />
                  <Button type="submit" disabled={isSubmitting || isSubmitted}>
                    {isSubmitting
                      ? "Joining..."
                      : isSubmitted
                      ? "Joined!"
                      : "Join Waitlist"}
                  </Button>
                </form>
                <p className="mt-1 text-xs text-muted-foreground">
                  Get early access and exclusive launch offers.
                </p>
              </div>
            </div>
          </div>
          {/* <div className="flex items-center justify-center">
            <div className="relative h-[350px] w-full md:h-[400px] lg:h-[500px]">
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="Game marketing dashboard"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
