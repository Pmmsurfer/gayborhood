import type { Metadata } from "next";
import Link from "next/link";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Create account — Gayborhood",
  description: "Create an account to create communities and post.",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-paper">
      <main
        id="main-content"
        className="mx-auto max-w-board px-[18px] pb-12 pt-8"
      >
        <h1 className="font-bebas text-2xl tracking-[2px] text-ink">
          CREATE ACCOUNT
        </h1>
        <p className="mt-2 font-courier text-sm text-faded">
          You need an account to create a community or post.
        </p>
        <div className="mt-8 max-w-sm">
          <SignupForm />
        </div>
        <footer className="mt-8 border-t border-rule pt-4 font-courier text-xs text-faded">
          <Link href="/" className="text-link hover:underline">
            ← Home
          </Link>
        </footer>
      </main>
    </div>
  );
}
