import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: 'user' | 'agent' | 'admin';
      isAdmin?: boolean;
    };
  }

  interface User {
    id: string;
    role?: 'user' | 'agent' | 'admin';
    isAdmin?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'user' | 'agent' | 'admin';
    isAdmin?: boolean;
    email?: string;
    name?: string;
  }
}

