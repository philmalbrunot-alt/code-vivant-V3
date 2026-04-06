'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BrandHeader, Container, Panel, Shell } from '@/app/components/v3/ui';

export default function CheckoutSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const sessionId = params.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      router.replace('/resultat');
      return;
    }
    router.replace(`/lecture/prepare?session_id=${encodeURIComponent(sessionId)}`);
  }, [router, sessionId]);

  return (
    <Shell>
      <Container className="max-w-3xl">
        <BrandHeader compact />
        <Panel>
          <p className="text-sm text-cv-muted">Paiement confirmé. Redirection vers votre lecture complète…</p>
        </Panel>
      </Container>
    </Shell>
  );
}
