#!/usr/bin/env tsx
/**
 * Script to check Google OAuth configuration
 * Run: npx tsx scripts/check-google-oauth.ts
 */

const checkGoogleOAuth = () => {
  console.log('🔍 Checking Google OAuth Configuration...\n');

  // Check environment variables
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const nextAuthUrl = process.env.NEXTAUTH_URL;
  const railwayDomain = process.env.RAILWAY_PUBLIC_DOMAIN;

  console.log('📋 Environment Variables:');
  console.log('─────────────────────────────────────');
  
  if (clientId) {
    console.log('✅ GOOGLE_CLIENT_ID:', clientId.substring(0, 30) + '...');
  } else {
    console.log('❌ GOOGLE_CLIENT_ID: NOT SET');
  }

  if (clientSecret) {
    console.log('✅ GOOGLE_CLIENT_SECRET:', clientSecret.substring(0, 10) + '... (hidden)');
  } else {
    console.log('❌ GOOGLE_CLIENT_SECRET: NOT SET');
  }

  if (nextAuthUrl) {
    console.log('✅ NEXTAUTH_URL:', nextAuthUrl);
  } else {
    console.log('⚠️  NEXTAUTH_URL: NOT SET (will use request headers)');
  }

  if (railwayDomain) {
    console.log('✅ RAILWAY_PUBLIC_DOMAIN:', railwayDomain);
  } else {
    console.log('⚠️  RAILWAY_PUBLIC_DOMAIN: NOT SET');
  }

  console.log('\n🔗 Expected Redirect URI:');
  console.log('─────────────────────────────────────');
  
  const baseUrl = nextAuthUrl || (railwayDomain ? `https://${railwayDomain}` : 'http://localhost:3000');
  const callbackUrl = `${baseUrl}/api/auth/callback/google`;
  
  console.log('Base URL:', baseUrl);
  console.log('Callback URL:', callbackUrl);
  console.log('\n📝 Add this EXACT URL to Google Console:');
  console.log('─────────────────────────────────────');
  console.log(callbackUrl);
  console.log('\n✅ Make sure this URL is in:');
  console.log('   - Authorized JavaScript origins:', baseUrl);
  console.log('   - Authorized redirect URIs:', callbackUrl);

  console.log('\n🔍 Verification:');
  console.log('─────────────────────────────────────');
  
  if (!clientId || !clientSecret) {
    console.log('❌ Google OAuth credentials not set');
    console.log('   Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to Railway Variables');
  } else {
    console.log('✅ Google OAuth credentials are set');
  }

  if (!nextAuthUrl && !railwayDomain) {
    console.log('⚠️  NEXTAUTH_URL not set - NextAuth will use request headers');
    console.log('   This is OK, but make sure Railway URL is in Google Console');
  }

  console.log('\n📚 Next Steps:');
  console.log('─────────────────────────────────────');
  console.log('1. Copy the callback URL above');
  console.log('2. Go to: https://console.cloud.google.com/apis/credentials');
  console.log('3. Edit your OAuth 2.0 Client ID');
  console.log('4. Add the callback URL to "Authorized redirect URIs"');
  console.log('5. Add the base URL to "Authorized JavaScript origins"');
  console.log('6. Click Save');
  console.log('7. Wait 1-2 minutes, then try Google login again');
};

checkGoogleOAuth();

