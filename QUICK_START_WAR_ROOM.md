# 🚀 QUICK START - DIRECTOR'S WAR ROOM

**Get the tactical dashboard running in 3 minutes**

---

## ⚡ INSTANT SETUP

### 1. Navigate to Frontend

```bash
cd Prachar.ai/prachar-ai
```

### 2. Install Dependencies (if needed)

```bash
npm install
```

**Required packages (should already be installed):**
- `framer-motion` - Animations
- `lucide-react` - Icons
- `next` - Framework
- `react` - Core

### 3. Start Development Server

```bash
npm run dev
```

**Server starts at:** `http://localhost:3000`

---

## 🎯 TESTING THE WAR ROOM

### Step 1: Login

1. Navigate to `http://localhost:3000`
2. Click "Sign In" button
3. Login with your Cognito credentials

### Step 2: Enter War Room

After login, you'll see:
- **Left Sidebar (400px):** Director's Terminal with chat interface
- **Right Canvas (Fluid):** Campaign results area
- **Bottom Status Bar:** System status indicators

### Step 3: Generate Campaign

1. Type in chat input: `"Create a viral campaign for my college tech fest"`
2. Press Enter or click Send button
3. Watch the magic:
   - Status bar updates to `TIER_1`
   - AI reasoning indicator appears
   - Typewriter effect reveals response
   - Campaign cards animate in
   - Status updates to `ACTIVE`

### Step 4: Interact with Results

- **Hover over cards:** See scanline effect
- **Click copy icons:** Copy individual assets
- **View visual asset:** Campaign image displayed
- **Check status bar:** Real-time system status

---

## 🎨 VISUAL FEATURES TO VERIFY

### Background Effects
- [ ] Cyan-indigo radial glow visible in center
- [ ] Black (#000000) base color
- [ ] Zinc-900 surfaces on sidebar

### Sidebar (Left)
- [ ] Fixed at 400px width
- [ ] Glassmorphism effect (backdrop-blur-xl)
- [ ] Terminal header with user email
- [ ] Chat messages scrollable
- [ ] Input field at bottom
- [ ] Send button (indigo-600)

### Canvas (Right)
- [ ] Fills remaining space (fluid)
- [ ] Strategy cards in 3-column grid
- [ ] Caption cards in 3-column grid
- [ ] Visual asset full-width
- [ ] All cards have hover effects

### Status Bar (Bottom)
- [ ] Shows TIER status (color-coded)
- [ ] Shows DB_SYNC status
- [ ] Shows REGION (US-EAST-1)
- [ ] Online pulse indicator (green)

### Animations
- [ ] Card entrance (staggered delays)
- [ ] Scanline on hover (vertical sweep)
- [ ] Scale-up on hover (1.05x)
- [ ] Typewriter effect on AI messages
- [ ] Smooth auto-scroll in chat

---

## 🔧 TROUBLESHOOTING

### Issue: Components not found

**Solution:**
```bash
# Verify file structure
ls -la src/components/CampaignDashboard.tsx
ls -la src/app/page.tsx
```

### Issue: Framer Motion errors

**Solution:**
```bash
npm install framer-motion@latest
```

### Issue: Icons not showing

**Solution:**
```bash
npm install lucide-react@latest
```

### Issue: API calls failing

**Check:**
1. `.env.local` has `NEXT_PUBLIC_API_URL`
2. Lambda function URL is correct
3. CORS headers enabled on Lambda

### Issue: Typewriter effect not working

**Check:**
1. `isTyping` state is set to `true`
2. `typewriterText` has content
3. No console errors

---

## 📊 EXPECTED BEHAVIOR

### On Page Load (Logged In)
1. Director's War Room renders immediately
2. No flash of empty content
3. Chat input is focused and ready
4. Status bar shows "STANDBY"

### On Message Send
1. User message appears instantly
2. Generate button disables
3. Status updates to "TIER_1"
4. AI reasoning indicator shows
5. After response:
   - Assistant message appears with typewriter
   - Campaign cards animate in (staggered)
   - Status updates to "ACTIVE"
   - DB_SYNC updates to "SYNCED"

### On Card Hover
1. Scanline effect sweeps vertically
2. Card scales up slightly (1.05x)
3. Border color transitions
4. Smooth 1000ms animation

### On Copy Click
1. Text copied to clipboard
2. Icon changes to check mark
3. Green color indicates success
4. Reverts after 2 seconds

---

## 🎬 DEMO SCRIPT

**For Hackathon Judges:**

### Opening (30 seconds)
> "Welcome to Prachar.ai's Director's War Room - a tactical dashboard for campaign generation. Notice the professional split-pane layout with glassmorphism effects and real-time status indicators."

### Feature 1: Stateful Chat (1 minute)
> "Let me create a campaign. I'll type: 'Create a viral campaign for my college tech fest.' Watch the typewriter effect as the AI responds, and notice how the conversation history is preserved for context-aware refinement."

### Feature 2: Campaign Assets (1 minute)
> "The campaign assets appear with staggered entrance animations. Each card has a scanline hover effect - watch this vertical sweep. I can copy any asset with one click. The visual asset is displayed full-width with hover effects."

### Feature 3: System Status (30 seconds)
> "The status bar shows real-time system information: TIER_1 indicates we're using Gemini 3 Flash Preview, DB_SYNC shows DynamoDB persistence, and the green pulse confirms the system is online."

### Feature 4: Refinement (1 minute)
> "Now I'll refine the campaign: 'Make it more aggressive with power words.' The system maintains conversation context, and the AI generates an improved version. This is true stateful agent architecture."

### Closing (30 seconds)
> "This is Prachar.ai - combining enterprise-grade backend with a professional tactical UI. 100% uptime, stateful conversations, and a user experience that makes campaign generation feel like commanding a war room."

**Total Demo Time: 4 minutes**

---

## ✅ PRE-DEMO CHECKLIST

### Backend
- [ ] Lambda function deployed
- [ ] Environment variables set
- [ ] DynamoDB table created
- [ ] API keys configured
- [ ] CORS headers enabled

### Frontend
- [ ] Dependencies installed
- [ ] `.env.local` configured
- [ ] Development server running
- [ ] No console errors
- [ ] All animations working

### Test Flow
- [ ] Login works
- [ ] Chat input accepts text
- [ ] Generate button works
- [ ] Typewriter effect shows
- [ ] Cards animate in
- [ ] Hover effects work
- [ ] Copy buttons work
- [ ] Status bar updates
- [ ] Logout works

### Demo Prep
- [ ] Clear browser cache
- [ ] Test campaign prompts ready
- [ ] Backup prompts prepared
- [ ] Screen recording ready
- [ ] Presentation slides ready

---

## 🎯 SUCCESS METRICS

### Performance
- **Initial Load:** <2 seconds
- **Message Send:** <3 seconds (Tier 1)
- **Typewriter Effect:** Smooth, no lag
- **Animations:** 60 FPS
- **No Errors:** Clean console

### User Experience
- **Intuitive:** No instructions needed
- **Responsive:** Immediate feedback
- **Professional:** Polished appearance
- **Reliable:** No crashes or bugs
- **Engaging:** Fun to use

### Technical
- **Stateful:** Conversation history works
- **Robust:** Handles errors gracefully
- **Scalable:** No performance issues
- **Maintainable:** Clean code structure
- **Documented:** Comprehensive docs

---

## 🚀 DEPLOYMENT

### Vercel Deployment

```bash
# Commit changes
git add .
git commit -m "feat: Director's War Room UI complete"
git push origin main
```

**Vercel auto-deploys from main branch.**

### Environment Variables (Vercel)

Add to Vercel dashboard:
```
NEXT_PUBLIC_API_URL=https://your-lambda-url
```

### Post-Deployment Testing

1. Visit production URL
2. Test login flow
3. Generate test campaign
4. Verify all features work
5. Check mobile responsiveness

---

## 📞 SUPPORT

### Issues?

1. Check console for errors
2. Verify API endpoint
3. Test Lambda function directly
4. Review documentation
5. Check GitHub issues

### Questions?

- **Architecture:** See `DIRECTORS_WAR_ROOM_COMPLETE.md`
- **Backend:** See `STATEFUL_AGENT_COMPLETE.md`
- **API:** See `AWS_CONFIG_REFERENCE.md`
- **Deployment:** See `PRODUCTION_READY_FINAL.md`

---

**Team NEONX - AI for Bharat Hackathon**  
**Date:** March 5, 2026  
**Status:** 🟢 READY FOR DEMO  

🎉 **LET'S DOMINATE THE HACKATHON!** 🎉
