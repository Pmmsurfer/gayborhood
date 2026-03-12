import Link from "next/link";

type Post = {
  id: string;
  title: string;
  category: string;
  event_date: string | null;
  price_cents: number | null;
  rsvp_count: number;
};

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d + "Z").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function PaidEventCard({ post }: { post: Post }) {
  const price =
    post.price_cents != null
      ? `$${Math.round(post.price_cents / 100)}`
      : null;

  return (
    <div className="flex flex-wrap items-baseline gap-x-2 border-b border-rule py-2 font-courier text-sm">
      <span className="text-faded">[paid · {price}]</span>
      <Link href={`/post/${post.id}`} className="text-link hover:underline">
        {post.title}
      </Link>
      <span className="text-faded">
        · {post.category} · {formatDate(post.event_date)} · {post.rsvp_count} going
      </span>
    </div>
  );
}
