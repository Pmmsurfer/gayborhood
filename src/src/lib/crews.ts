export type Crew = {
  id: string;
  gayborhood_slug: string;
  name: string;
  schedule: string;
  location: string;
  blurb: string;
  linkHref?: string | null;
};

const CREWS: Crew[] = [
  {
    id: "la-run-club",
    gayborhood_slug: "la-westside",
    name: "Sunday Morning Run Club",
    schedule: "Sundays · 8:30am",
    location: "Santa Monica bluffs → beach path",
    blurb: "4–5 miles at a conversational pace. Coffee after.",
    linkHref: "/submit?city=la-westside",
  },
  {
    id: "la-potluck",
    gayborhood_slug: "la-westside",
    name: "Thursday Queer Potluck",
    schedule: "Thursdays · 7:00pm",
    location: "Rotating apartments · West Side",
    blurb: "Small-group dinners. Bring a dish or a drink.",
    linkHref: "/submit?city=la-westside",
  },
  {
    id: "la-book-circle",
    gayborhood_slug: "la-westside",
    name: "Gayborhood Book Circle",
    schedule: "2nd Tuesday · 7:30pm",
    location: "Local cafés between Santa Monica & Venice",
    blurb: "Queer books, short essays, and zines. Low‑pressure.",
    linkHref: "/submit?city=la-westside",
  },
];

export function getCrewsForCity(slug: string): Crew[] {
  return CREWS.filter((crew) => crew.gayborhood_slug === slug);
}
