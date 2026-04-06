import { PremiumReadingPage } from '@/app/components/v3/premium-reading';

export default async function ReadingPage({ params }: { params: Promise<{ token: string }> }) {
  const resolved = await params;
  return <PremiumReadingPage token={resolved.token} />;
}
