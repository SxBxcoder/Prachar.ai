# 🎨 DIRECTOR'S WAR ROOM - VISUAL REFERENCE

**Complete Visual Design Specifications**

---

## 🎯 DESIGN PHILOSOPHY

**Concept:** Tactical Command Center  
**Mood:** Professional, High-Tech, Elite  
**Target:** Gen-Z Creators & Campus Leaders  
**Inspiration:** Military War Rooms, Trading Floors, Mission Control  

---

## 🎨 COLOR SYSTEM

### Base Colors

```css
/* Primary Background */
--black: #000000;              /* Deepest black - main background */
--zinc-950: #09090b;           /* Near black - alternative */

/* Surface Colors */
--zinc-900: #18181b;           /* Primary surface - sidebar, cards */
--zinc-800: #27272a;           /* Secondary surface - borders */
--zinc-700: #3f3f46;           /* Tertiary surface - hover states */

/* Text Colors */
--white: #ffffff;              /* Primary text */
--zinc-100: #f4f4f5;           /* Secondary text */
--zinc-400: #a1a1aa;           /* Tertiary text */
--zinc-500: #71717a;           /* Quaternary text */
--zinc-600: #52525b;           /* Disabled text */
```

### Accent Colors

```css
/* Primary Accents */
--indigo-400: #818cf8;         /* Light accent */
--indigo-500: #6366f1;         /* Primary buttons, links */
--indigo-600: #4f46e5;         /* Button hover */
--indigo-700: #4338ca;         /* Button active */

/* Secondary Accents */
--purple-400: #c084fc;         /* Light purple */
--purple-500: #a855f7;         /* AI reasoning glow */
--purple-600: #9333ea;         /* Purple hover */

/* Tertiary Accents */
--cyan-400: #22d3ee;           /* Light cyan */
--cyan-500: #06b6d4;           /* Cyan highlights */
--cyan-600: #0891b2;           /* Cyan hover */

/* Quaternary Accents */
--pink-400: #f472b6;           /* Light pink */
--pink-500: #ec4899;           /* CTA accents */
--pink-600: #db2777;           /* Pink hover */
```

### Status Colors

```css
/* Success */
--green-400: #4ade80;          /* Online, success */
--green-500: #22c55e;          /* Success hover */

/* Warning */
--yellow-400: #facc15;         /* Processing, warning */
--yellow-500: #eab308;         /* Warning hover */

/* Error */
--red-400: #f87171;            /* Error, danger */
--red-500: #ef4444;            /* Error hover */
```

---

## 📐 LAYOUT SPECIFICATIONS

### Grid System

```
┌─────────────────────────────────────────────────────────────┐
│                    VIEWPORT (100vw × 100vh)                 │
├──────────────────┬──────────────────────────────────────────┤
│                  │                                          │
│  LEFT SIDEBAR    │         RIGHT CANVAS                     │
│  400px (fixed)   │         calc(100vw - 400px) (fluid)     │
│                  │                                          │
│  ┌────────────┐  │  ┌────────────────────────────────────┐ │
│  │  Header    │  │  │  Content Area                      │ │
│  │  (auto)    │  │  │  (padding: 32px)                   │ │
│  └────────────┘  │  │                                    │ │
│                  │  │  ┌──────────────────────────────┐  │ │
│  ┌────────────┐  │  │  │  Strategy Cards (3-col)      │  │ │
│  │  Messages  │  │  │  │  gap: 16px                   │  │ │
│  │  (flex-1)  │  │  │  └──────────────────────────────┘  │ │
│  │  (scroll)  │  │  │                                    │ │
│  └────────────┘  │  │  ┌──────────────────────────────┐  │ │
│                  │  │  │  Caption Cards (3-col)       │  │ │
│  ┌────────────┐  │  │  │  gap: 16px                   │  │ │
│  │  Input     │  │  │  └──────────────────────────────┘  │ │
│  │  (auto)    │  │  │                                    │ │
│  └────────────┘  │  │  ┌──────────────────────────────┐  │ │
│                  │  │  │  Visual Asset (full-width)   │  │ │
│                  │  │  │  aspect-ratio: 16/9          │  │ │
│                  │  │  └──────────────────────────────┘  │ │
│                  │  └────────────────────────────────────┘ │
│                  │                                          │
├──────────────────┴──────────────────────────────────────────┤
│  STATUS BAR (100vw × auto, padding: 12px 24px)             │
└─────────────────────────────────────────────────────────────┘
```

### Spacing Scale

```css
/* Tailwind Spacing */
--spacing-1: 4px;      /* gap-1, p-1 */
--spacing-2: 8px;      /* gap-2, p-2 */
--spacing-3: 12px;     /* gap-3, p-3 */
--spacing-4: 16px;     /* gap-4, p-4 */
--spacing-6: 24px;     /* gap-6, p-6 */
--spacing-8: 32px;     /* gap-8, p-8 */
--spacing-12: 48px;    /* gap-12, p-12 */
```

### Border Radius

```css
/* Tailwind Rounded */
--rounded-lg: 8px;     /* rounded-lg */
--rounded-xl: 12px;    /* rounded-xl */
--rounded-2xl: 16px;   /* rounded-2xl */
--rounded-3xl: 24px;   /* rounded-3xl */
--rounded-full: 9999px; /* rounded-full */
```

---

## 🎭 COMPONENT STYLES

### Sidebar (Left Panel)

```css
/* Container */
width: 400px;
background: rgba(24, 24, 27, 0.5); /* zinc-900/50 */
backdrop-filter: blur(24px);       /* backdrop-blur-xl */
border-right: 1px solid #27272a;   /* border-zinc-800 */

/* Header */
padding: 16px;
border-bottom: 1px solid #27272a;

/* Messages Area */
flex: 1;
overflow-y: auto;
padding: 16px;
gap: 16px;

/* Input Area */
padding: 16px;
border-top: 1px solid #27272a;
```

### Canvas (Right Panel)

```css
/* Container */
flex: 1;
overflow-y: auto;
padding: 32px;

/* Strategy Cards Grid */
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 16px;

/* Caption Cards Grid */
display: grid;
grid-template-columns: repeat(3, 1fr);
gap: 16px;

/* Visual Asset */
width: 100%;
aspect-ratio: 16 / 9;
border-radius: 16px;
```

### Card Component

```css
/* Base */
background: #18181b;               /* zinc-900 */
border: 1px solid #27272a;         /* zinc-800 */
border-radius: 16px;               /* rounded-2xl */
padding: 24px;                     /* p-6 */
position: relative;
overflow: hidden;

/* Hover State */
border-color: rgba(99, 102, 241, 0.5); /* indigo-500/50 */
transform: scale(1.05);
transition: all 300ms;

/* Scanline Overlay */
position: absolute;
inset: 0;
background: linear-gradient(
  to bottom,
  transparent,
  rgba(99, 102, 241, 0.05),
  transparent
);
transform: translateY(-100%);
transition: transform 1000ms;
pointer-events: none;

/* Scanline on Hover */
transform: translateY(100%);
```

### Status Bar

```css
/* Container */
border-top: 1px solid #27272a;     /* border-zinc-800 */
background: rgba(24, 24, 27, 0.8); /* zinc-900/80 */
backdrop-filter: blur(24px);       /* backdrop-blur-xl */
padding: 12px 24px;                /* px-6 py-3 */
display: flex;
justify-content: space-between;
align-items: center;
font-family: monospace;
font-size: 12px;

/* Status Indicator */
display: flex;
align-items: center;
gap: 8px;

/* Status Colors */
.tier-standby { color: #a1a1aa; }  /* zinc-400 */
.tier-active { color: #4ade80; }   /* green-400 */
.tier-processing { color: #facc15; } /* yellow-400 */
.tier-error { color: #f87171; }    /* red-400 */
```

---

## ✨ EFFECTS & ANIMATIONS

### Radial Glow Background

```css
/* Fixed Background Layer */
position: fixed;
inset: 0;
pointer-events: none;
z-index: 0;

/* Glow Element */
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
width: 800px;
height: 800px;
background: radial-gradient(
  circle,
  rgba(6, 182, 212, 0.1),    /* cyan-500/10 */
  rgba(99, 102, 241, 0.05),  /* indigo-500/5 */
  transparent
);
filter: blur(80px);
```

### Glassmorphism

```css
/* Sidebar Glassmorphism */
background: rgba(24, 24, 27, 0.5); /* zinc-900/50 */
backdrop-filter: blur(24px);       /* backdrop-blur-xl */
border: 1px solid rgba(39, 39, 42, 1); /* zinc-800 */
```

### Scanline Effect

```css
/* Scanline Overlay */
@keyframes scanline {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(100%);
  }
}

.scanline {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(99, 102, 241, 0.05),
    transparent
  );
  animation: scanline 1s ease-in-out;
  pointer-events: none;
}
```

### Typewriter Effect

```typescript
// Character-by-character reveal
const typewriterEffect = (text: string, speed: number = 20) => {
  let index = 0;
  const interval = setInterval(() => {
    if (index < text.length) {
      setDisplayText(text.slice(0, index + 1));
      index++;
    } else {
      clearInterval(interval);
    }
  }, speed);
};
```

### Entrance Animations

```typescript
// Framer Motion Variants
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.3,
      ease: 'easeOut'
    }
  })
};
```

### Hover Animations

```css
/* Scale on Hover */
.card:hover {
  transform: scale(1.05);
  transition: transform 300ms ease-out;
}

/* Border Glow on Hover */
.card:hover {
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
  transition: all 300ms ease-out;
}
```

---

## 🔤 TYPOGRAPHY

### Font Families

```css
/* Sans Serif (Default) */
font-family: system-ui, -apple-system, BlinkMacSystemFont, 
             'Segoe UI', Roboto, 'Helvetica Neue', Arial, 
             sans-serif;

/* Monospace (Code, Status) */
font-family: 'Courier New', Courier, monospace;
```

### Font Sizes

```css
/* Headings */
--text-xs: 12px;       /* Status bar, labels */
--text-sm: 14px;       /* Chat messages, captions */
--text-base: 16px;     /* Body text */
--text-lg: 18px;       /* Card content */
--text-xl: 20px;       /* Card titles */
--text-2xl: 24px;      /* Section headers */

/* Font Weights */
--font-normal: 400;
--font-medium: 500;
--font-bold: 700;
```

### Line Heights

```css
--leading-tight: 1.25;   /* Headings */
--leading-normal: 1.5;   /* Body text */
--leading-relaxed: 1.75; /* Captions */
```

---

## 🎯 INTERACTIVE STATES

### Button States

```css
/* Default */
background: #6366f1;     /* indigo-500 */
color: #ffffff;
padding: 8px 16px;
border-radius: 8px;
transition: all 200ms;

/* Hover */
background: #4f46e5;     /* indigo-600 */
transform: translateY(-1px);
box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);

/* Active */
background: #4338ca;     /* indigo-700 */
transform: translateY(0);

/* Disabled */
background: #3f3f46;     /* zinc-700 */
color: #71717a;          /* zinc-500 */
cursor: not-allowed;
opacity: 0.5;
```

### Input States

```css
/* Default */
background: #27272a;     /* zinc-800 */
border: 1px solid #3f3f46; /* zinc-700 */
color: #ffffff;
padding: 8px 16px;
border-radius: 8px;

/* Focus */
border-color: #6366f1;   /* indigo-500 */
outline: 2px solid rgba(99, 102, 241, 0.5);
outline-offset: 2px;

/* Disabled */
background: #18181b;     /* zinc-900 */
color: #71717a;          /* zinc-500 */
cursor: not-allowed;
```

### Card States

```css
/* Default */
border: 1px solid #27272a; /* zinc-800 */
transform: scale(1);

/* Hover */
border-color: rgba(99, 102, 241, 0.5);
transform: scale(1.05);
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);

/* Active (Clicked) */
transform: scale(0.98);
```

---

## 📱 RESPONSIVE BREAKPOINTS

### Desktop (Default)
```css
/* Optimized for 1920×1080 and above */
--sidebar-width: 400px;
--canvas-padding: 32px;
--grid-columns: 3;
```

### Tablet (1024px - 1919px)
```css
/* Adjust for medium screens */
--sidebar-width: 350px;
--canvas-padding: 24px;
--grid-columns: 2;
```

### Mobile (<1024px)
```css
/* Stack layout */
--sidebar-width: 100%;
--canvas-padding: 16px;
--grid-columns: 1;
flex-direction: column;
```

---

## 🎨 ICON SYSTEM

### Icon Library: Lucide React

```typescript
import {
  Send,        // Chat send button
  Sparkles,    // AI/generation indicator
  Terminal,    // Sidebar header
  Activity,    // Status bar - TIER
  Database,    // Status bar - DB_SYNC
  Globe,       // Status bar - REGION
  Copy,        // Copy button
  Check,       // Copy success
  Zap,         // Quick action
  LogOut       // Logout button
} from 'lucide-react';
```

### Icon Sizes

```css
--icon-xs: 12px;   /* w-3 h-3 */
--icon-sm: 16px;   /* w-4 h-4 */
--icon-md: 20px;   /* w-5 h-5 */
--icon-lg: 24px;   /* w-6 h-6 */
--icon-xl: 32px;   /* w-8 h-8 */
```

---

## ✅ VISUAL CHECKLIST

### Background
- [ ] Black (#000000) base color
- [ ] Cyan-indigo radial glow visible
- [ ] Glow centered and blurred
- [ ] Fixed position, no scroll

### Sidebar
- [ ] Fixed at 400px width
- [ ] Glassmorphism effect (backdrop-blur-xl)
- [ ] Zinc-900/50 background
- [ ] Border-right zinc-800
- [ ] Header with Terminal icon
- [ ] User email displayed
- [ ] Logout button visible

### Canvas
- [ ] Fills remaining space (fluid)
- [ ] 32px padding
- [ ] Strategy cards in 3-column grid
- [ ] Caption cards in 3-column grid
- [ ] Visual asset full-width
- [ ] 16px gap between cards

### Cards
- [ ] Zinc-900 background
- [ ] Zinc-800 border
- [ ] 16px border-radius (rounded-2xl)
- [ ] 24px padding (p-6)
- [ ] Copy button in top-right
- [ ] Scanline overlay on hover
- [ ] Scale-up on hover (1.05x)

### Status Bar
- [ ] At bottom of viewport
- [ ] Zinc-900/80 background
- [ ] Backdrop-blur-xl
- [ ] Border-top zinc-800
- [ ] TIER status with icon
- [ ] DB_SYNC status with icon
- [ ] REGION status with icon
- [ ] Online pulse indicator

### Animations
- [ ] Card entrance (staggered)
- [ ] Scanline on hover (1000ms)
- [ ] Scale on hover (300ms)
- [ ] Typewriter effect (20ms/char)
- [ ] Auto-scroll smooth

---

**Team NEONX - AI for Bharat Hackathon**  
**Date:** March 5, 2026  
**Document:** Visual Reference Guide  
**Status:** 🟢 COMPLETE  

🎨 **VISUAL DESIGN SPECIFICATIONS COMPLETE!** 🎨
