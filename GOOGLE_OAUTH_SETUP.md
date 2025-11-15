# Google OAuth Setup Guide for ConsilAI

## Step 1: Enable Google OAuth in Supabase

1. Go to your Supabase project: https://app.supabase.com
2. Navigate to **Authentication** → **Providers**
3. Find **Google** and click to enable it
4. You'll need a Google OAuth 2.0 Client ID and Secret

## Step 2: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   - `https://[your-project].supabase.co/auth/v1/callback?provider=google`
   - `http://localhost:3000/auth/callback` (for local development)
7. Copy the **Client ID** and **Client Secret**

## Step 3: Configure Supabase

1. In Supabase, paste your Google Client ID and Secret in the Google provider settings
2. Save the configuration

## Step 4: Update Environment Variables

Your `.env.local` file should already have:
```
NEXT_PUBLIC_SUPABASE_URL=https://qrzlzjadrfwllxienabj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

These are already configured in your workspace.

## Step 5: Install Dependencies

Run in the frontend directory:
```bash
npm install
```

## Step 6: Test Google OAuth

1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:3000/login`
3. Click "Sign in with Google"
4. Complete the Google OAuth flow
5. You should be redirected to the home page with a personalized greeting

## Features Implemented

✅ Google OAuth authentication via Supabase
✅ Login page with Google sign-in button
✅ User profile in navbar with sign-out option
✅ Personalized greeting on landing page ("Hello, [Name]!")
✅ Protected routes ready for implementation
✅ Auth state management with React Context

## Troubleshooting

- **Redirect URI mismatch**: Ensure your redirect URI exactly matches in Google Console
- **CORS issues**: Make sure your Supabase URL is added to CORS settings
- **Token issues**: Clear cookies and try again if session issues occur
