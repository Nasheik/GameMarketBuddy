import { signUpAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";

export default async function Signup(props: {
  searchParams: Promise<Message>;
}) {
  const searchParams = await props.searchParams;
  if ("message" in searchParams) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500">
        <div className="w-full max-w-md px-4">
          <FormMessage message={searchParams} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500">
      <div className="w-full max-w-md px-4">
        <div className="space-y-8 rounded-2xl border-2 border-blue-400 bg-white/90 p-8 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 shadow-md">
              <span className="text-3xl font-bold text-blue-500">GM</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Create an account</h1>
            <p className="text-base text-gray-700">
              Already have an account?{" "}
              <Link className="text-blue-700 font-semibold hover:underline" href="/sign-in">
                Sign in
              </Link>
            </p>
          </div>
          <form className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 text-base">Email</Label>
                <Input 
                  name="email" 
                  placeholder="you@example.com" 
                  required 
                  className="h-12 text-base"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 text-base">Password</Label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Your password"
                  minLength={6}
                  required
                  className="h-12 text-base"
                />
              </div>
            </div>
            <SubmitButton 
              formAction={signUpAction} 
              pendingText="Signing up..." 
              className="w-full h-12 text-lg font-bold bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg hover:from-blue-600 hover:to-blue-800"
            >
              Sign up
            </SubmitButton>
            <FormMessage message={searchParams} />
          </form>
          <SmtpMessage />
        </div>
      </div>
    </div>
  );
}
