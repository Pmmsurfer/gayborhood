import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

const SignupForm = dynamic(() => import("./SignupForm"), { ssr: false });

export const metadata: Metadata = {
  title: "Sign up — Gayborhood",
  description: "Create an account to create communities and post.",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-paper">
      <main
        id="main-content"
        className="mx-auto max-w-board px-[18px] pb-12 pt-8"
      >
        <h1 className="font-bebas text-2xl tracking-[2px] text-ink">
          SIGN UP
        </h1>
        <p className="mt-2 font-courier text-sm text-faded">
          You need an account to create a community or post.
        </p>
        <div className="mt-8 max-w-sm">
          <SignupForm />
        </div>
        <footer className="mt-8 border-t border-rule pt-4 font-courier text-xs text-faded">
          <Link href="/login" className="text-link hover:underline">
            ← Back to sign in
          </Link>
        </footer>
      </main>
    </div>
  );
}
