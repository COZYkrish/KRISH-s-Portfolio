# Krish Sharma Portfolio - Deployment Guide

## 🚀 Quick Deploy Options

### Option 1: GitHub Pages (Free)
1. Push your code to GitHub
2. Go to Repository Settings → Pages
3. Select "Deploy from a branch"
4. Choose "main" branch and "/portfolio" folder
5. Your site will be live at: `https://yourusername.github.io/repository-name/`

### Option 2: Netlify (Free)
1. Go to [netlify.com](https://netlify.com)
2. Drag & drop your `portfolio` folder
3. Site deploys automatically
4. Get a free `.netlify.app` URL

### Option 3: Vercel (Free)
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set build command to "echo 'Static site'"
4. Deploy automatically

### Option 4: Firebase Hosting (Free)
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 📋 Pre-Deployment Checklist

- [ ] Test locally: `python -m http.server 8000`
- [ ] Check all links work
- [ ] Upload resume to Google Drive/Dropbox and update link
- [ ] Test on mobile devices
- [ ] Compress images if needed
- [ ] Update contact information

## 🔧 Current Issues Fixed

1. ✅ Created `package.json` for deployment
2. ✅ Fixed broken resume link (update with your actual resume URL)
3. ✅ All dependencies are CDN-hosted (no build needed)

## 🌐 Your Site is Ready!

Your portfolio is a **static website** - perfect for free hosting platforms. No server-side code, no databases, just pure HTML/CSS/JS magic! ✨