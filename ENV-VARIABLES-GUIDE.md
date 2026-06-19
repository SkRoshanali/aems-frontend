# 🔐 Environment Variables Guide

**Frontend:** AEMS (Agri Export Management System)  
**Date:** June 19, 2026  
**Status:** Current configuration documented  

---

## 📋 Current Environment Variables

### ✅ Production (`.env.production`)
```env
VITE_API_BASE_URL=https://aems-backend-1-w9zj.onrender.com/api
VITE_APP_NAME=AEMS
VITE_APP_VERSION=1.0.0
VITE_JWT_EXPIRY_MINUTES=30
```

### ✅ Development (`.env.development`)
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=AEMS
VITE_APP_VERSION=1.0.0
VITE_JWT_EXPIRY_MINUTES=30
```

---

## 📖 Variable Descriptions

| Variable | Type | Purpose | Example |
|----------|------|---------|---------|
| `VITE_API_BASE_URL` | String | Backend API base URL | `https://aems-backend-1-w9zj.onrender.com/api` |
| `VITE_APP_NAME` | String | Application display name | `AEMS` |
| `VITE_APP_VERSION` | String | Application version | `1.0.0` |
| `VITE_JWT_EXPIRY_MINUTES` | Number | JWT token expiry time in minutes | `30` |

---

## ❓ Do You Need Google API Keys?

### **Answer: NO** ✅

#### Reason:
Your frontend application **does NOT** use Google APIs because:

1. **No Maps Integration**
   - No Google Maps implementation
   - No location-based features using Maps API
   - No mapping of farms/locations

2. **No Google Auth**
   - Using custom JWT authentication
   - Backend handles auth with Spring Boot
   - No OAuth/Sign-in with Google

3. **No Google Services**
   - No Gmail integration
   - No Google Drive uploads
   - No Google Sheets sync
   - No Analytics script

4. **Location Data Handling**
   - Using Indian states/cities dropdown (hardcoded in `src/constants/india.js`)
   - No real-time geocoding
   - No reverse geocoding
   - Simple form-based location selection

#### What You're Using Instead:
```
✅ Custom JWT tokens (Backend generates, Frontend stores in localStorage)
✅ Hardcoded India location data (states, districts, PIN codes)
✅ Simple form inputs for addresses
✅ No third-party location services
```

---

## 🔧 What Environment Variables Are Actually Used?

### In Code:
```javascript
// From vite.config.js / main.jsx
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const APP_NAME = import.meta.env.VITE_APP_NAME
const APP_VERSION = import.meta.env.VITE_APP_VERSION
const JWT_EXPIRY = import.meta.env.VITE_JWT_EXPIRY_MINUTES
```

### Usage Examples:

#### 1. **API Calls** (Used everywhere)
```javascript
// In src/api/chatService.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
axios.post(`${API_BASE_URL}/chat/query`, ...)
// Results in: https://aems-backend-1-w9zj.onrender.com/api/chat/query
```

#### 2. **Auth Token Expiry** (Used in SessionTimer)
```javascript
// In src/components/SessionTimer.jsx
const expiryMinutes = import.meta.env.VITE_JWT_EXPIRY_MINUTES || 30;
const warningTime = expiryMinutes * 0.75; // Show warning at 75% expiry
```

#### 3. **App Name** (Used in UI)
```javascript
// In various components
<h1>{import.meta.env.VITE_APP_NAME}</h1> // Displays "AEMS"
```

---

## 🔍 How Vite Environment Variables Work

### File Naming Convention
```
.env                      # Loaded in all environments
.env.local                # Local overrides (git ignored)
.env.production           # Production env (committed)
.env.development          # Development env (committed)
.env.production.local     # Production local override (git ignored)
.env.development.local    # Development local override (git ignored)
```

### Prefix Requirement
- Variables MUST start with `VITE_` to be exposed to frontend
- Vite automatically handles the `VITE_` prefix stripping
- Without prefix: `import.meta.env.SECRET` = `undefined`

### Load Priority (Higher wins):
1. `.env` (lowest priority)
2. `.env.development` / `.env.production`
3. `.env.development.local` / `.env.production.local` (highest priority)

---

## 🛠️ How to Add New Environment Variables

### Step 1: Add to `.env.production`
```env
VITE_API_BASE_URL=https://aems-backend-1-w9zj.onrender.com/api
VITE_APP_NAME=AEMS
VITE_APP_VERSION=1.0.0
VITE_JWT_EXPIRY_MINUTES=30
VITE_YOUR_NEW_VAR=your_value  # ← Add new variable with VITE_ prefix
```

### Step 2: Add to `.env.development`
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=AEMS
VITE_APP_VERSION=1.0.0
VITE_JWT_EXPIRY_MINUTES=30
VITE_YOUR_NEW_VAR=dev_value   # ← Different value for local development
```

### Step 3: Use in Code
```javascript
const myVariable = import.meta.env.VITE_YOUR_NEW_VAR;
console.log(myVariable); // "your_value" in production, "dev_value" in development
```

### Step 4: Restart Dev Server (If needed)
```bash
npm run dev  # Vite automatically detects .env changes and reloads
```

---

## 🚀 Deploying with Environment Variables

### Azure Static Web Apps Configuration

1. **In Azure Portal:**
   - Go to Static Web Apps → Settings → Configuration
   - Add environment variables:
     - Name: `VITE_API_BASE_URL`
     - Value: `https://aems-backend-1-w9zj.onrender.com/api`

2. **OR In GitHub Secrets (For Build Time):**
   ```bash
   # GitHub → Settings → Secrets → Actions
   VITE_API_BASE_URL = https://aems-backend-1-w9zj.onrender.com/api
   ```

3. **OR In `.env.production` (Current approach):**
   ```
   ✅ Already committed to git
   ✅ Used at build time by Vite
   ✅ Baked into production build
   ```

---

## 📊 Current Frontend Dependencies

```json
{
  "react": "^18.x",
  "react-redux": "^9.2.0",
  "@reduxjs/toolkit": "^2.11.2",
  "react-router-dom": "^7.13.2",
  "axios": "^1.13.6",           // ← For API calls
  "recharts": "^3.8.1",          // ← For charts (no Maps)
  "lucide-react": "^1.18.0",     // ← For icons
  "tailwindcss": "^3.4.1",       // ← For styling
  "vite": "^8.0.1"               // ← Build tool
}
```

### No Google Dependencies:
- ❌ `@react-google-maps/api`
- ❌ `@googlemaps/js-api-loader`
- ❌ `react-google-login`
- ❌ `google-map-react`

---

## 🔐 Sensitive Variables (DO NOT Commit)

### Should use `.env.local` or `.env.*.local`:
```env
# .env.production.local (git ignored)
VITE_SECRET_KEY=abc123...  # ← Not in repo
VITE_API_TOKEN=xyz789...   # ← Not in repo
VITE_PRIVATE_KEY=...       # ← Not in repo
```

### Currently Safe ✅
All current `.env` files are safe to commit:
- No private keys
- No API tokens
- No secrets
- All are configuration values

---

## 📱 Environment Variables by Deployment

### Local Development
```env
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=AEMS
VITE_JWT_EXPIRY_MINUTES=30
```

### Staging (If added)
```env
VITE_API_BASE_URL=https://aems-backend-staging.onrender.com/api
VITE_APP_NAME=AEMS (Staging)
VITE_JWT_EXPIRY_MINUTES=30
```

### Production (Current)
```env
VITE_API_BASE_URL=https://aems-backend-1-w9zj.onrender.com/api
VITE_APP_NAME=AEMS
VITE_JWT_EXPIRY_MINUTES=30
```

---

## ✅ Verification Checklist

- ✅ No Google APIs required
- ✅ No external API keys needed
- ✅ Environment variables correctly configured
- ✅ Backend URL correct for production
- ✅ All variables have `VITE_` prefix
- ✅ No sensitive data in `.env` files
- ✅ Build will inject variables at compile time

---

## 🆘 Common Environment Variable Issues

### Issue: Variable is `undefined`
**Cause:** Missing `VITE_` prefix or typo
```javascript
// ❌ Wrong
const url = import.meta.env.API_BASE_URL;  // undefined

// ✅ Correct
const url = import.meta.env.VITE_API_BASE_URL;  // works
```

### Issue: Wrong value in production
**Cause:** Using `.env.development` values instead of `.env.production`
```bash
# ❌ Wrong - rebuilds with dev values
npm run dev && npm run build

# ✅ Correct - uses production values
npm run build  # Automatically uses .env.production
```

### Issue: Changes not taking effect
**Cause:** Dev server not reloaded or using cached build
```bash
# ✅ Solution
npm run dev  # Stop and restart dev server
# OR
npm run build && npm run preview  # Preview production build locally
```

---

## 📝 Summary

### Current Setup ✅
- **4 environment variables** configured
- **No Google APIs** needed or used
- **Backend URL** centralized in env vars
- **Auth tokens** handled by backend
- **Location data** hardcoded (Indian states/cities)

### If You Want to Add Google Services (Future):
You would need to add:
```env
# For Google Maps
VITE_GOOGLE_MAPS_API_KEY=your_key_here

# For Google Auth
VITE_GOOGLE_CLIENT_ID=your_client_id_here

# For Google Analytics
VITE_GOOGLE_ANALYTICS_ID=your_tracking_id_here
```

But currently, **none of these are needed** ✅

---

## 🔗 Related Documentation

- **Vite Docs:** https://vitejs.dev/guide/env-and-modes.html
- **Azure Static Web Apps Env Vars:** https://docs.microsoft.com/en-us/azure/static-web-apps/
- **Environment File Best Practices:** https://github.com/motdotla/dotenv

---

**Status:** 🟢 **Environment Configuration Complete & Verified**

No additional API keys or external services required for current functionality.
