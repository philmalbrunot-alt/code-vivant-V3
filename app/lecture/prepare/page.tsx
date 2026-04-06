import { PaymentTransitionPage } from '@/app/components/v3/payment-transition';

export default async function PreparePage({
  searchParams,
}: {
  searchParams?: Promise<{ session_id?: string }>;
}) {
  const resolved = (await searchParams) || {};
  return <PaymentTransitionPage sessionId={resolved.session_id || ''} />;
}
