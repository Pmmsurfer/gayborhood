import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<{ next?: string }>;
};

export default async function SignupRedirectPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const redirectTo = next
    ? `/login/sign-up?next=${encodeURIComponent(next)}`
    : "/login/sign-up";
  redirect(redirectTo);
}
