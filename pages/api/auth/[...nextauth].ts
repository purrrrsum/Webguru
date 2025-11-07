import NextAuth from 'next-auth';
import type { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '@/lib/auth';

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  const currentUrl = process.env.NEXTAUTH_URL || '';

  if (!currentUrl || currentUrl.includes('localhost')) {
    const forwardedProto = (req.headers['x-forwarded-proto'] as string) || 'https';
    const forwardedHost = (req.headers['x-forwarded-host'] as string) || '';
    const host = forwardedHost || req.headers.host || '';

    if (host && !host.includes('localhost')) {
      process.env.NEXTAUTH_URL = `${forwardedProto}://${host}`;
    } else {
      process.env.NEXTAUTH_URL = 'https://www.thesupport.agency';
    }
  }

  return NextAuth(req, res, authOptions);
}

