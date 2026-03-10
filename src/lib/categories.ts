/** Single source of truth for post categories and grouping */

export const BOARD_EXCLUDE_CATEGORIES = [
  "roommate",
  "gear",
  "borrow",
  "lend",
  "skill_swap",
  "missed_connection",
  "anonymous",
  "recommendation",
] as const;

export const BOARD_EXCLUDE_IN = `(${BOARD_EXCLUDE_CATEGORIES.join(",")})`;

export const EVENT_CATEGORIES = [
  "dinner",
  "potluck",
  "surf",
  "hiking",
  "books",
  "film",
  "walk",
  "drinks",
  "biking",
  "beach_day",
  "farmers_market",
  "game_night",
  "volunteer",
  "supper_club",
  "guided_hike",
  "workshop",
  "other_paid",
] as const;

export const PAID_EVENT_CATEGORIES = [
  "supper_club",
  "guided_hike",
  "workshop",
  "other_paid",
] as const;

export const ANONYMOUS_CATEGORIES = ["missed_connection", "anonymous"] as const;

export const CLASSIFIED_CATEGORIES = [
  "roommate",
  "gear",
  "borrow",
  "lend",
  "skill_swap",
  "classified_misc",
] as const;

export const FREE_EVENT_CATEGORIES = [
  "dinner",
  "potluck",
  "surf",
  "hiking",
  "books",
  "film",
  "walk",
  "drinks",
  "biking",
  "beach_day",
  "farmers_market",
  "game_night",
  "volunteer",
] as const;

/** For submit form: grouped options with labels */
export const CATEGORY_GROUPS: { label: string; options: { value: string; label: string }[] }[] = [
  {
    label: "Free events",
    options: [
      { value: "dinner", label: "Dinner" },
      { value: "potluck", label: "Potluck" },
      { value: "surf", label: "Surf" },
      { value: "hiking", label: "Hiking" },
      { value: "books", label: "Books" },
      { value: "film", label: "Film" },
      { value: "walk", label: "Walk" },
      { value: "drinks", label: "Drinks" },
      { value: "biking", label: "Biking" },
      { value: "beach_day", label: "Beach Day" },
      { value: "farmers_market", label: "Farmers Market" },
      { value: "game_night", label: "Game Night" },
      { value: "volunteer", label: "Volunteer" },
    ],
  },
  {
    label: "Paid events",
    options: [
      { value: "supper_club", label: "Supper Club" },
      { value: "guided_hike", label: "Guided Hike" },
      { value: "workshop", label: "Workshop" },
      { value: "other_paid", label: "Other (paid)" },
    ],
  },
  {
    label: "Board",
    options: [
      { value: "board_post", label: "Board Post" },
      { value: "question", label: "Question" },
      { value: "lost_and_found", label: "Lost & Found" },
    ],
  },
  {
    label: "Classifieds",
    options: [
      { value: "roommate", label: "Roommate" },
      { value: "gear", label: "Gear" },
      { value: "borrow", label: "Borrow" },
      { value: "lend", label: "Lend" },
      { value: "skill_swap", label: "Skill Swap" },
      { value: "classified_misc", label: "Misc" },
    ],
  },
  {
    label: "Other",
    options: [
      { value: "missed_connection", label: "Missed Connection" },
      { value: "anonymous", label: "Anonymous" },
      { value: "recommendation", label: "Recommendation" },
    ],
  },
];

export const EVENT_VALUES_SET = new Set<string>([
  ...FREE_EVENT_CATEGORIES,
  ...PAID_EVENT_CATEGORIES,
]);

export const PAID_EVENT_VALUES_SET = new Set<string>(PAID_EVENT_CATEGORIES);
export const ANON_VALUES_SET = new Set<string>(ANONYMOUS_CATEGORIES);
