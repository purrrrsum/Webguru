import { NextRequest, NextResponse } from 'next/server';

// Simple character matching function
function simpleCharacterMatch(username: string, password: string): boolean {
  const normalizedUsername = username.toLowerCase().trim();
  const normalizedPassword = password.toLowerCase().trim();
  
  // Direct match
  if (normalizedUsername === normalizedPassword) {
    return true;
  }
  
  // Check if password contains all characters from username
  const usernameChars = normalizedUsername.split('').filter(c => c !== '@' && c !== '.' && c !== ' ');
  const passwordChars = normalizedPassword.split('');
  
  // Check if all username characters exist in password
  const allCharsMatch = usernameChars.every(char => passwordChars.includes(char));
  
  return allCharsMatch;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    // Extract username from email (part before @)
    const username = email.split('@')[0];

    // Use simple character matching instead of hardcoded credentials
    if (!simpleCharacterMatch(username, password)) {
      return NextResponse.json({ error: 'Invalid credentials. Username and password must have matching characters.' }, { status: 401 });
    }

    // Create simple agent user object without database
    const agentUser = {
      id: `agent_${email.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`,
      email: email,
      name: username.charAt(0).toUpperCase() + username.slice(1),
      role: 'agent' as const,
      company: '',
      address: '',
      phone: '',
      jobCount: 0,
    };

    return NextResponse.json({
      success: true,
      user: agentUser,
      email: agentUser.email,
    });
  } catch (error) {
    console.error('Error in admin login:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
