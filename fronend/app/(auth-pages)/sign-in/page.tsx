import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-blue-300 to-blue-500">
      <div className="w-full max-w-md px-4">
        <div className="space-y-8 rounded-2xl border-2 border-blue-400 bg-white/90 p-8 shadow-2xl backdrop-blur-md">
          <div className="flex flex-col items-center space-y-2 text-center">
            <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 shadow-md">
              <span className="text-3xl font-bold text-blue-500">GM</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Welcome back</h1>
            <p className="text-base text-gray-700">
              Don't have an account?{" "}
              <Link className="text-blue-700 font-semibold hover:underline" href="/sign-up">
                Sign up
              </Link>
            </p>
          </div>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 text-base">Email</Label>
              <Input name="email" placeholder="you@example.com" required className="h-12 text-base" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-700 text-base">Password</Label>
                <Link className="text-xs text-blue-600 hover:underline" href="/forgot-password">
                  Forgot Password?
                </Link>
              </div>
              <Input type="password" name="password" placeholder="Your password" required className="h-12 text-base" />
            </div>
            <SubmitButton pendingText="Signing In..." formAction={signInAction} className="w-full h-12 text-lg font-bold bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg hover:from-blue-600 hover:to-blue-800">
              Sign in
            </SubmitButton>
            <FormMessage message={searchParams} />
          </form>
        </div>
      </div>
    </div>
  );
}
