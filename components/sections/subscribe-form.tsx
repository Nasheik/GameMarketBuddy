// app/components/SubscribeForm.tsx
"use client";

import { useState } from "react";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setStatus("error");
      setMessage("Please enter your email address.");
      return;
    }

    try {
      setStatus("loading");
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Thank you for subscribing!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-sm items-center space-x-2"
    >
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-gray-600 hover:bg-gray-700 text-white py-3 px-5 rounded-md transition duration-200 text-nowrap disabled:opacity-70"
      >
        {status === "loading" ? "Joining..." : "Join Waitlist"}
      </button>

      {status === "success" && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
          {message}
        </div>
      )}

      {status === "error" && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {message}
        </div>
      )}
    </form>
  );
}
