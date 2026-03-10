import Link from "next/link";

type Post = {
  id: string;
  title: string;
  created_at: string;
  reply_count: number;
  like_count: number;
};

function timeAgo(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const sec = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (sec < 60) return "just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  if (sec < 604800) return `${Math.floor(sec / 86400)}d ago`;
  return d.toLocaleDateString();
}

export default function MissedConnectionCard({ post }: { post: Post }) {
  return (
    <div className="missed-connection flex flex-wrap items-baseline gap-x-2 border-b border-rule py-2 font-courier text-sm">
      <Link
        href={`/post/${post.id}`}
        className="italic text-link hover:underline"
      >
        {post.title}
      </Link>
      <span className="text-faded">
        · {timeAgo(post.created_at)} · {post.reply_count} replies · ♥ {post.like_count}
      </span>
    </div>
  );
}
