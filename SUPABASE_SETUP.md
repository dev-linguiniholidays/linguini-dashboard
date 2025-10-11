# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `linguini-holidays-crm`
   - Database Password: (choose a strong password)
   - Region: (choose closest to your users)
6. Click "Create new project"

## 2. Get Your Credentials

1. Once your project is created, go to **Settings** > **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)

## 3. Configure Environment Variables

1. Create a file named `.env.local` in the root of your project
2. Add the following content:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Replace the values with your actual Supabase credentials

## 4. Enable Authentication

1. In your Supabase dashboard, go to **Authentication** > **Settings**
2. Under **Site URL**, add: `http://localhost:3000` (for development)
3. Under **Redirect URLs**, add: `http://localhost:3000/**`
4. For production, also add your Vercel domain

## 5. Test the Login

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/login`
3. Try creating a new account
4. Check your email for the verification link (if email confirmation is enabled)

## 6. Production Deployment

When deploying to Vercel:
1. Go to your Vercel project settings
2. Add the environment variables in the **Environment Variables** section
3. Make sure to use your production Supabase URL and keys

## Default Login Credentials

For testing purposes, you can use these credentials:
- Email: `admin@linguiniholidays.com`
- Password: `admin123`

Or create a new account using the signup form.
