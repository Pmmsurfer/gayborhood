"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { incrementLike } from "@/actions/incrementLike";
import { isPostLiked, isReplyLiked, setPostLiked, setReplyLiked } from "@/lib/likes";

type Props = {
  targetTable: "posts" | "replies";
  rowId: string;
  likeCount: number;
  className?: string;
};

export default function LikeButton({ targetTable, rowId, likeCount, className = "" }: Props) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(likeCount);

  useEffect(() => {
    const check = targetTable === "posts" ? isPostLiked(rowId) : isReplyLiked(rowId);
    setLiked(check);
  }, [targetTable, rowId]);

  async function handleClick() {
    if (liked) return;
    const result = await incrementLike(targetTable, rowId);
    if (result.ok) {
      if (targetTable === "posts") setPostLiked(rowId);
      else setReplyLiked(rowId);
      setLiked(true);
      setCount((c) => c + 1);
      router.refresh();
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-1 border-none bg-transparent p-0 font-courier text-sm text-ink cursor-pointer hover:underline ${className}`}
      aria-pressed={liked}
    >
      <span className={liked ? "text-brick" : ""}>♥</span>{" "}
      <span>{liked ? "liked" : "like"}</span>
      {count > 0 && <span className="text-faded">({count})</span>}
    </button>
  );
}
