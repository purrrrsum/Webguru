import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'user' | 'agent';
    };
  }

  interface User {
    id: string;
    role?: 'user' | 'agent';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'user' | 'agent';
  }
}

