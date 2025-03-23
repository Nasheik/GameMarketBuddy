"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SubscribeForm from "./subscribe-form";

const HeroSection = () => {
  // const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState("");
  const [buttonLoading, setButtonLoading] = useState(false);
  // const toast = useToast();

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // if (!emailInput) {
    //   return toast({
    //     description: "Email is required",
    //     status: "error",
    //   });
    // }
    setButtonLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        body: JSON.stringify({ email: emailInput }),
      });
      const data = await res.json();
      if (data.success) {
        //  toast({
        //   title: 'Joined successfully.',
        //   description: "Thank you for joining the waitlist!",
        //   status: 'success'
        // });
      } else {
        throw new Error(
          data?.error || "Something went wrong, please try again later"
        );
      }
    } catch (e) {
      //  toast({
      //    description: (e as Error).message,
      //    status: 'error'
      //  });
    }
    setEmailInput("");
    setButtonLoading(false);
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
                {/* <form
                  id="signup"
                  className="flex w-full max-w-sm items-center space-x-2"
                  onSubmit={handleFormSubmit}
                > */}
                <SubscribeForm />
                {/* <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                    disabled={isSubmitting || isSubmitted}
                  />
                  <Button type="submit" disabled={isSubmitting || isSubmitted}>
                    {isSubmitting
                      ? "Joining..."
                      : isSubmitted
                      ? "Joined!"
                      : "Join Waitlist"}
                  </Button> */}
                {/* </form> */}
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
