import Link from "next/link";

type Post = {
  id: string;
  title: string;
  category: string;
  created_at: string;
};

function categoryLabel(cat: string) {
  const labels: Record<string, string> = {
    roommate: "Roommates",
    gear: "Gear",
    borrow: "Borrowed & Lent",
    lend: "Borrowed & Lent",
    skill_swap: "Skill Swaps",
    classified_misc: "Misc",
  };
  return labels[cat] || cat;
}

export default function ClassifiedItem({ post }: { post: Post }) {
  return (
    <div className="border-b border-rule py-1.5 font-courier text-sm">
      <span className="text-faded">{categoryLabel(post.category)}</span>
      {" · "}
      <Link href={`/post/${post.id}`} className="text-link hover:underline">
        {post.title}
      </Link>
    </div>
  );
}
