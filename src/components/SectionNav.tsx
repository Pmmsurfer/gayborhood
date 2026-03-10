import Link from "next/link";

type Counts = {
  thisWeek: number;
  board: number;
  missedConnections: number;
  anonymous: number;
  classifieds: number;
  recs: number;
};

export default function SectionNav({ counts }: { counts: Counts }) {
  const links = [
    { id: "this-week", label: "This Week", count: counts.thisWeek },
    { id: "board", label: "Board", count: counts.board },
    { id: "missed", label: "Missed Connections", count: counts.missedConnections },
    { id: "anonymous", label: "Anonymous", count: counts.anonymous },
    { id: "classifieds", label: "Classifieds", count: counts.classifieds },
    { id: "recs", label: "Recs", count: counts.recs },
    { id: "join", label: "Join", count: null },
  ];

  return (
    <nav className="mb-6 font-courier text-sm text-ink" aria-label="Sections">
      {links.map(({ id, label, count }) => (
        <span key={id}>
          <Link href={`#${id}`} className="text-link hover:underline">
            {label}
            {count != null ? ` (${count})` : ""}
          </Link>
          {id !== "join" && " · "}
        </span>
      ))}
    </nav>
  );
}
