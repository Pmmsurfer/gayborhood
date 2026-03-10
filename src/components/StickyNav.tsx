"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "This Week", href: "#this-week" },
  { label: "Board", href: "#board" },
  { label: "Missed Connections", href: "#missed" },
  { label: "Anonymous", href: "#anonymous" },
  { label: "Classifieds", href: "#classifieds" },
  { label: "Recs", href: "#recs" },
  { label: "Join", href: "#join" },
];

export default function StickyNav() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 180);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 py-3 px-[18px] font-courier text-sm text-paper transition-transform duration-200 ${
        visible ? "translate-y-0 bg-ink" : "-translate-y-full"
      }`}
      id="sticky-nav"
      aria-label="Section navigation"
    >
      <div className="mx-auto flex max-w-board flex-wrap items-center gap-x-6 gap-y-1">
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="text-paper no-underline hover:underline"
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
