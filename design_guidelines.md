# MicroMentor Design Guidelines

## Design Approach
**Reference-Based Approach**: Drawing inspiration from inclusive, warm social platforms like LinkedIn's professional growth features and Instagram's community aspects, combined with the accessibility-first design of modern productivity tools.

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Deep Navy Blue: 210 73% 15% (#0A2342) - Primary brand color for buttons and headers
- Light Mode: Deep Navy Blue as primary
- Dark Mode: Dusty Teal (202 39% 55%) for better contrast

**Background Colors:**
- Light Mode: 60 44% 91% (Cream #F5F55DC) - Warm, welcoming base
- Dark Mode: 210 73% 8% (Very Dark Navy) - Professional depth

**Supporting Colors:**
- Charcoal Gray: 204 19% 26% (#36454F) - Text and borders
- Soft Gold: 46 61% 52% (#D4AF37) - Accent highlights and CTAs
- Dusty Teal: 202 39% 44% (#447B9B) - Secondary actions and links
- Cream: 60 44% 91% (#F5F55DC) - Backgrounds and light surfaces

**System Colors:**
- Success: 142 76% 36% (encouraging green)
- Warning: 38 92% 50% (gentle amber)
- Error: 0 84% 60% (supportive red)

**Gradients:**
- Hero sections: Subtle gradient from Deep Navy to Dusty Teal
- Card backgrounds: Very subtle cream to gold overlays (3% opacity)

### B. Typography
**Font Families:**
- Primary: Inter (Google Fonts) - clean, accessible
- Secondary: Source Sans Pro for body text

**Hierarchy:**
- Hero: 32px/40px, font-weight 700
- H1: 28px/36px, font-weight 600
- H2: 24px/32px, font-weight 600
- H3: 20px/28px, font-weight 500
- Body: 16px/24px, font-weight 400
- Caption: 14px/20px, font-weight 400

### C. Layout System
**Tailwind Spacing Units:** Consistent use of 4, 8, 12, 16, 24, 32 units
- Component padding: p-4, p-6, p-8
- Section spacing: mb-8, mb-12, mb-16
- Grid gaps: gap-4, gap-6

### D. Component Library

**Navigation:**
- Bottom tab bar for mobile (mentee: Ask, My Questions, Library)
- Floating action button for "Ask Question" (primary CTA)
- Simple header with user avatar and logout

**Cards & Content:**
- Question cards: Rounded corners (rounded-xl), subtle shadow, left border accent
- Answer cards: Elevated appearance with mentor avatar
- Progress cards: Gradient backgrounds with stats

**Forms:**
- Input fields: Rounded borders (rounded-lg), focus states with primary color
- Buttons: Rounded (rounded-lg), gradient backgrounds for primary actions
- Voice input: Prominent microphone button with recording animation

**Data Display:**
- Progress tracking: Visual progress bars and achievement badges
- Stats dashboard: Grid layout with icon + number + label format
- Wisdom library: Card-based layout with tagging system

**Overlays:**
- Modals: Slide-up animation for mobile, rounded top corners
- Notifications: Toast-style with appropriate color coding
- Question submission: Multi-step flow with progress indicator

### E. Animations
**Minimal & Purposeful:**
- Page transitions: Simple slide animations (300ms ease-out)
- Button interactions: Subtle scale (1.02) on press
- Loading states: Skeleton screens rather than spinners
- Voice recording: Gentle pulse animation on microphone icon

## Mobile-First Considerations

**Touch Targets:**
- Minimum 44px tap targets
- Generous spacing between interactive elements
- Thumb-friendly bottom navigation

**Voice Integration:**
- Large, accessible voice recording buttons
- Visual feedback during recording (waveform or pulse)
- Clear audio playback controls

**Inclusive Design:**
- High contrast mode support
- Adequate color contrast ratios (4.5:1 minimum)
- Clear visual hierarchy for screen readers
- Pronoun display in user profiles
- Trauma-aware language and gentle interactions

## Brand Voice Integration
**Warm & Encouraging:** Soft color transitions, rounded corners, and generous whitespace
**Accessible:** Clear typography hierarchy, consistent navigation patterns
**Growth-Oriented:** Progress visualization, achievement celebrations, wisdom accumulation metaphors

## Safety & Trust
**Visual Trust Signals:**
- Mentor verification badges
- Clear privacy indicators (public/private questions)
- Gentle content moderation messaging
- Crisis support resources easily accessible

This design system prioritizes warmth, accessibility, and growth while maintaining professional credibility for the mentorship context.