'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';

export default function AgentVerifyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAgent, setIsAgent] = useState(false);

  useEffect(() => {
    const verifyAgent = async () => {
      if (status === 'loading') return;
      
      if (!session?.user?.email) {
        router.push('/agent-login');
        return;
      }

      try {
        // Check if user is an agent
        const response = await fetch(`/api/user/check?email=${session.user.email}`);
        if (response.ok) {
          const data = await response.json();
          if (data.role === 'agent') {
            setIsAgent(true);
            // Update session to reflect agent role
            router.push('/dashboard');
          } else {
            // Not an agent, redirect to user login
            router.push('/auth/signin?error=not_agent');
          }
        } else {
          router.push('/agent-login?error=verification_failed');
        }
      } catch (error) {
        router.push('/agent-login?error=verification_failed');
      } finally {
        setChecking(false);
      }
    };

    verifyAgent();
  }, [session, status, router]);

  if (checking || status === 'loading') {
    return (
      <>
        <Navigation />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-whatsapp-green text-xl">Verifying agent status...</div>
        </div>
      </>
    );
  }

  return null;
}

