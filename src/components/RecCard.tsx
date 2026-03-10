import Link from "next/link";

type Post = {
  id: string;
  title: string;
  category: string;
  body: string;
  like_count: number;
};

export default function RecCard({ post }: { post: Post }) {
  const quote = post.body.length > 120 ? post.body.slice(0, 120) + "…" : post.body;
  return (
    <div className="border-b border-rule py-2 font-courier text-sm">
      <span className="text-faded">{post.category}</span>
      {" · "}
      <Link href={`/post/${post.id}`} className="text-link hover:underline">
        {post.title}
      </Link>
      <p className="mt-1 text-faded">&ldquo;{quote}&rdquo;</p>
      <p className="mt-0.5 text-faded">♥ {post.like_count} votes</p>
    </div>
  );
}
