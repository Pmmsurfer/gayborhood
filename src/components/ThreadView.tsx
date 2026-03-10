"use client";

import { useState } from "react";
import Link from "next/link";
import LikeButton from "./LikeButton";
import RsvpBlock from "./RsvpBlock";
import ReplyForm from "./ReplyForm";
import type { Post } from "@/lib/supabase";

type Reply = {
  id: string;
  post_id: string;
  body: string;
  author_name: string;
  neighborhood: string | null;
  like_count: number;
  created_at: string;
};

type RsvpAttendee = { name: string; neighborhood: string | null };

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

type Props = {
  post: Post;
  replies: Reply[];
  attendees: RsvpAttendee[];
  boardName: string;
};

export default function ThreadView({ post, replies, attendees, boardName }: Props) {
  const [replyToPrefix, setReplyToPrefix] = useState("");

  const isEvent = post.event_date != null;
  const isAnonymousThread =
    post.category === "missed_connection" || post.category === "anonymous";
  const maxLikeCount = replies.length ? Math.max(...replies.map((r) => r.like_count)) : 0;
  const hasTopReply = maxLikeCount > 0;

  return (
    <div className="mx-auto max-w-board px-[18px] pb-12 pt-6">
      <p className="mb-4 font-courier text-sm text-faded">
        <Link
          href={`/${post.place_slug}/${post.community_slug}`}
          className="text-link hover:underline"
        >
          ← {boardName}
        </Link>
      </p>

      {/* Original post */}
      <article className="border-b border-rule pb-6">
        <p className="mb-1 font-courier text-sm text-faded">{post.category}</p>
        <h1 className="font-bebas text-2xl tracking-[2px] text-ink">{post.title}</h1>
        <p className="mt-2 font-courier text-sm text-faded">
          {post.author_name}
          {post.neighborhood ? ` · ${post.neighborhood}` : ""} · {timeAgo(post.created_at)}
        </p>
        <div
          className={`mt-3 font-courier text-sm text-ink whitespace-pre-wrap ${isAnonymousThread ? "italic text-faded" : ""}`}
        >
          {post.body}
        </div>
        <div className="mt-3">
          <LikeButton targetTable="posts" rowId={post.id} likeCount={post.like_count} />
        </div>
      </article>

      {/* RSVP block (events only) */}
      {isEvent && (
        <div className="py-6">
          <RsvpBlock post={post} attendees={attendees} />
        </div>
      )}

      {/* Replies */}
      <section className="mt-6">
        <h2 className="section-head font-bebas tracking-[2px] text-ink">
          REPLIES ({replies.length})
        </h2>
        <div className="space-y-4">
          {replies.map((reply, index) => {
            const num = index + 1;
            const isTop = hasTopReply && reply.like_count === maxLikeCount;
            return (
              <div
                key={reply.id}
                className={`border-b border-rule pb-4 ${isTop ? "top-reply border-l-2 border-l-brick pl-3" : ""}`}
              >
                <div className="flex flex-wrap items-baseline gap-x-2 font-courier text-sm">
                  <span className="font-bold text-ink">{num}.</span>
                  <span className="text-ink">{reply.author_name}</span>
                  {reply.neighborhood && (
                    <span className="text-faded">· {reply.neighborhood}</span>
                  )}
                  <span className="text-faded">· {timeAgo(reply.created_at)}</span>
                </div>
                <div
                  className={`mt-1 font-courier text-sm whitespace-pre-wrap ${isAnonymousThread ? "italic text-faded" : "text-ink"}`}
                >
                  {reply.body}
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4">
                  <LikeButton
                    targetTable="replies"
                    rowId={reply.id}
                    likeCount={reply.like_count}
                  />
                  <button
                    type="button"
                    onClick={() => setReplyToPrefix(`replying to #${num} — `)}
                    className="border-none bg-transparent p-0 font-courier text-sm text-link cursor-pointer hover:underline"
                  >
                    reply to this
                  </button>
                  {isTop && (
                    <span className="font-courier text-xs text-brick">top</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6">
          <ReplyForm
            postId={post.id}
            isAnonymousThread={isAnonymousThread}
            replyToPrefix={replyToPrefix}
            onClearReplyTo={() => setReplyToPrefix("")}
          />
        </div>
      </section>
    </div>
  );
}
