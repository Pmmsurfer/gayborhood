import type { Metadata } from "next";
import Link from "next/link";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign in — Gayborhood",
  description: "Sign in to create communities and post.",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-paper">
      <main
        id="main-content"
        className="mx-auto max-w-board px-[18px] pb-12 pt-8"
      >
        <h1 className="font-bebas text-2xl tracking-[2px] text-ink">
          SIGN IN
        </h1>
        <p className="mt-2 font-courier text-sm text-faded">
          Sign in to create communities and post to the board.
        </p>
        <div className="mt-8 max-w-sm">
          <LoginForm />
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
