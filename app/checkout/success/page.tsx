import { redirect } from "next/navigation";

type PageProps = {
  searchParams?: Promise<{
    session_id?: string;
    paid?: string;
  }>;
};

export default async function CheckoutSuccessPage({ searchParams }: PageProps) {
  const params = (await searchParams) ?? {};
  const sessionId = params.session_id;

  if (!sessionId) {
    redirect("/");
  }

  redirect(`/lecture/prepare?session_id=${encodeURIComponent(sessionId)}`);
}
