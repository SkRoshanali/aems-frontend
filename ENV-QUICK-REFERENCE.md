# ⚡ Environment Variables - Quick Reference

## Current Configuration

### ✅ What You Have
```env
VITE_API_BASE_URL=https://aems-backend-1-w9zj.onrender.com/api
VITE_APP_NAME=AEMS
VITE_APP_VERSION=1.0.0
VITE_JWT_EXPIRY_MINUTES=30
```

## ❓ Do You Need Google API Key?

### **NO** ✅

Your frontend:
- ✅ Does NOT use Google Maps
- ✅ Does NOT use Google Auth
- ✅ Does NOT use Google Analytics
- ✅ Uses custom JWT authentication (backend generates tokens)
- ✅ Uses hardcoded India location data (states, cities, PIN codes)

---

## 📋 What Each Variable Does

| Variable | Current Value | Purpose |
|----------|---------------|---------|
| `VITE_API_BASE_URL` | `https://aems-backend-1-w9zj.onrender.com/api` | Backend API location |
| `VITE_APP_NAME` | `AEMS` | App display name |
| `VITE_APP_VERSION` | `1.0.0` | Version number |
| `VITE_JWT_EXPIRY_MINUTES` | `30` | Session timeout (minutes) |

---

## 🔧 If You Want to Change Backend URL

**Development:**
```
File: .env.development
Change to: VITE_API_BASE_URL=http://your-backend:8080/api
```

**Production:**
```
File: .env.production
Change to: VITE_API_BASE_URL=https://your-domain.com/api
```

**Then rebuild:**
```bash
npm run build
```

---

## 🚀 Deployment

**Current setup already handles everything:**
- ✅ Environment variables baked into build
- ✅ Azure Static Web Apps will use `.env.production`
- ✅ No additional secrets needed

---

## ❓ Common Questions

**Q: Do I need Google Maps API key?**  
A: No, there's no maps feature in this app.

**Q: Do I need Google Auth?**  
A: No, uses backend JWT authentication.

**Q: Can I add Google Maps later?**  
A: Yes, add `VITE_GOOGLE_MAPS_API_KEY` to `.env` files when needed.

**Q: How do users provide locations?**  
A: Through dropdown selection of Indian states/cities.

---

## 📦 Files

- `.env.production` - Live production settings
- `.env.development` - Local development settings
- `ENV-VARIABLES-GUIDE.md` - Full detailed guide
- `ENV-QUICK-REFERENCE.md` - This file

---

**Status:** 🟢 No additional API keys required ✅
