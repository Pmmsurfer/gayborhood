const LIKED_PREFIX = "liked_post_";
const LIKED_REPLY_PREFIX = "liked_reply_";

export function getLikedPostIds(): string[] {
  if (typeof window === "undefined") return [];
  const ids: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key?.startsWith(LIKED_PREFIX)) {
      ids.push(key.slice(LIKED_PREFIX.length));
    }
  }
  return ids;
}

export function getLikedReplyIds(): string[] {
  if (typeof window === "undefined") return [];
  const ids: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key?.startsWith(LIKED_REPLY_PREFIX)) {
      ids.push(key.slice(LIKED_REPLY_PREFIX.length));
    }
  }
  return ids;
}

export function isPostLiked(postId: string): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(`${LIKED_PREFIX}${postId}`) === "1";
}

export function isReplyLiked(replyId: string): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(`${LIKED_REPLY_PREFIX}${replyId}`) === "1";
}

export function setPostLiked(postId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`${LIKED_PREFIX}${postId}`, "1");
}

export function setReplyLiked(replyId: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`${LIKED_REPLY_PREFIX}${replyId}`, "1");
}
