"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { submitReply } from "@/actions/submitReply";

type Props = {
  postId: string;
  isAnonymousThread: boolean;
  /** Prefill from "reply to this" — e.g. "replying to #3 — " */
  replyToPrefix?: string;
  onClearReplyTo?: () => void;
};

export default function ReplyForm({
  postId,
  isAnonymousThread,
  replyToPrefix = "",
  onClearReplyTo,
}: Props) {
  const router = useRouter();
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (replyToPrefix) setBody(replyToPrefix);
  }, [replyToPrefix]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("postId", postId);
    formData.set("body", body);
    const result = await submitReply(formData);
    if (result.ok) {
      setBody("");
      onClearReplyTo?.();
      router.refresh();
    } else {
      setError(result.error ?? "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border-t border-rule pt-4">
      <input type="hidden" name="postId" value={postId} />
      {!isAnonymousThread && (
        <>
          <div>
            <label htmlFor="reply-name" className="mb-1 block font-courier text-sm text-ink">
              Name
            </label>
            <input
              id="reply-name"
              type="text"
              name="author_name"
              className="w-full max-w-xs border-b border-ink bg-transparent font-courier"
            />
          </div>
          <div>
            <label htmlFor="reply-neighborhood" className="mb-1 block font-courier text-sm text-ink">
              Neighborhood (optional)
            </label>
            <input
              id="reply-neighborhood"
              type="text"
              name="neighborhood"
              className="w-full max-w-xs border-b border-ink bg-transparent font-courier"
            />
          </div>
        </>
      )}
      <div>
        <label htmlFor="reply-body" className="mb-1 block font-courier text-sm text-ink">
          Reply
        </label>
        <textarea
          id="reply-body"
          name="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          rows={4}
          className="w-full border-b border-ink bg-transparent font-courier"
        />
      </div>
      <button type="submit" className="btn font-bebas tracking-[3px]">
        POST REPLY
      </button>
      {error && <p className="font-courier text-sm text-brick">{error}</p>}
    </form>
  );
}
