import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPostById, getRepliesByPostId, getRsvpsByPostId } from "@/lib/db";
import ThreadView from "@/components/ThreadView";

type Params = { id: string };
type Props = { params: Params };

function truncate(str: string, max: number) {
  if (str.length <= max) return str;
  return str.slice(0, max).trim() + "…";
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = params;
  const post = await getPostById(id);
  if (!post) return { title: "Post not found" };
  const title = `${post.title} — Gayborhood`;
  const description = truncate(post.body.replace(/\s+/g, " "), 120);
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function ThreadPage({ params }: Props) {
  const { id } = params;

  const post = await getPostById(id);
  if (!post) notFound();

  const [replies, rsvps] = await Promise.all([
    getRepliesByPostId(id),
    getRsvpsByPostId(id),
  ]);

  const attendees = rsvps.map((r) => ({ name: r.name, neighborhood: r.neighborhood }));
  const boardName = `${post.place_slug}/${post.community_slug}`;

  return (
    <div id="main-content" className="min-h-screen bg-paper">
      <ThreadView
        post={post}
        replies={replies ?? []}
        attendees={attendees}
        boardName={boardName}
      />
    </div>
  );
}
