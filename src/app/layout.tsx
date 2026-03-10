import type { Metadata } from "next";
import { Bebas_Neue, Courier_Prime } from "next/font/google";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AuthLinks from "@/components/AuthLinks";
import "./globals.css";

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const courier = Courier_Prime({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-courier",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Gayborhood — Find your people",
  description: "A community notice board for gay and queer men, city by city.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={`${bebas.variable} ${courier.variable}`}>
      <body className="min-h-screen font-courier antialiased">
        <a
          href="#main-content"
          className="absolute left-[18px] top-2 z-[100] -translate-y-full bg-ink px-2 py-1 font-courier text-sm text-paper no-underline focus:translate-y-0 focus:outline-none"
        >
          Skip to main content
        </a>
        <header className="border-b border-rule bg-paper px-[18px] py-2">
          <div className="mx-auto flex max-w-board items-center justify-between">
            <Link href="/" className="font-bebas text-xl tracking-[2px] text-ink no-underline">
              Gayborhood
            </Link>
            <AuthLinks signedIn={!!user} />
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
