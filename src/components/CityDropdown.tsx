"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type Gayborhood = {
  slug: string;
  name: string;
  city: string;
  is_active: boolean;
};

export default function CityDropdown({
  cities,
  currentName,
}: {
  cities: Gayborhood[];
  currentName: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`City: ${currentName}. Click to change.`}
        className="inline-flex cursor-pointer items-baseline border-none bg-transparent p-0 text-left font-bebas text-lg tracking-[2px] text-link hover:underline"
      >
        {currentName}
        <span className="ml-2 font-courier text-sm text-faded">(change)</span>
      </button>
      {open && (
        <ul className="absolute left-0 top-full z-10 mt-1 min-w-[180px] border border-rule bg-paper py-1 font-courier text-sm">
          {cities.map((c) =>
            c.is_active ? (
              <li key={c.slug}>
                <Link
                  href={`/${c.slug}`}
                  className="block px-3 py-1.5 text-link hover:bg-rule hover:underline"
                  onClick={() => setOpen(false)}
                >
                  {c.name}
                </Link>
              </li>
            ) : (
              <li key={c.slug} className="block px-3 py-1.5 text-faded">
                {c.city} — starting soon
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}
