# LinguiniHolidaysCRM - Deployment Guide

## 🚀 Quick Deploy to Vercel

### Method 1: Direct Upload to GitHub + Vercel

1. **Create GitHub Repository**
   - Go to [GitHub.com](https://github.com)
   - Click "New repository"
   - Name: `linguini-holidays-crm`
   - Make it public
   - Don't initialize with README (we have files already)

2. **Upload Files to GitHub**
   - Download the `linguini-holidays-crm.zip` file
   - Extract the zip file
   - Go to your new GitHub repository
   - Click "uploading an existing file"
   - Drag and drop all the extracted files
   - Commit with message: "Initial commit - LinguiniHolidaysCRM"

3. **Deploy to Vercel**
   - Go to [Vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your `linguini-holidays-crm` repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

### Method 2: Vercel CLI (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd linguini-holidays
vercel

# Follow the prompts
```

## 📋 Pre-deployment Checklist

- ✅ Project builds successfully (`npm run build`)
- ✅ All dependencies are in package.json
- ✅ No hardcoded localhost URLs
- ✅ Environment variables configured (if any)
- ✅ Static assets are in public folder

## 🔧 Configuration

### Vercel Settings
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

### Environment Variables (if needed)
Add these in Vercel dashboard under Project Settings > Environment Variables:
- `NEXT_PUBLIC_APP_URL` (optional)

## 🐛 Troubleshooting

### Common Issues:

1. **Build Fails**
   - Check if all dependencies are in package.json
   - Ensure TypeScript errors are resolved
   - Check Vercel build logs

2. **Runtime Errors**
   - Check browser console for errors
   - Verify all imports are correct
   - Check if localStorage is being used (SSR issues)

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check if all CSS files are included

## 📱 Features Included

- ✅ Customer Management (CRUD)
- ✅ Role-based Access Control
- ✅ Comment System with Timestamps
- ✅ Search and Filtering
- ✅ Responsive Design
- ✅ Modern UI with shadcn/ui
- ✅ Real-time Updates

## 🔗 Live Demo

Once deployed, your app will be available at:
`https://linguini-holidays-crm.vercel.app` (or your custom domain)

## 📞 Support

If you encounter any issues during deployment, check:
1. Vercel deployment logs
2. GitHub repository setup
3. Build command execution
4. Environment configuration
