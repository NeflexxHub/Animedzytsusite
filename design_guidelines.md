# Design Guidelines: Anime Streaming Platform

## Design Approach
**Reference-Based Approach** drawing from Netflix, Crunchyroll, and Jut.su patterns. This is a media-rich, experience-focused platform where visual immersion and content discovery are paramount.

## Core Design Principles
- **Content-First**: Anime artwork and posters are the primary visual elements
- **Dark Theme Foundation**: Deep backgrounds that make vibrant anime artwork pop
- **Immersive Browsing**: Minimize UI chrome, maximize content visibility
- **Seamless Discovery**: Fluid navigation between catalog, details, and playback

## Typography System
**Font Stack**: 
- Primary: Inter or Roboto (clean, modern sans-serif via Google Fonts)
- Japanese Support: Noto Sans JP for anime titles in original language

**Hierarchy**:
- Hero Titles: text-4xl md:text-6xl font-bold
- Anime Titles: text-xl md:text-2xl font-semibold
- Section Headers: text-2xl md:text-3xl font-bold
- Body/Descriptions: text-base md:text-lg
- Metadata (genres, year): text-sm font-medium
- Episode Lists: text-sm md:text-base

## Layout System
**Spacing Primitives**: Use Tailwind units of 2, 4, 6, and 8 consistently
- Component padding: p-4, p-6, p-8
- Section spacing: space-y-6, space-y-8
- Grid gaps: gap-4, gap-6
- Margins: m-2, m-4, m-6

**Container Strategy**:
- Full-width sections: w-full with inner max-w-7xl mx-auto px-4 md:px-6
- Content areas: max-w-6xl mx-auto
- Video player: Contained within max-w-screen-2xl

## Page Structures

### Homepage
**Hero Section** (80vh):
- Large backdrop image from featured anime (full-width, gradient overlay)
- Left-aligned content (max-w-2xl):
  - Anime logo/title
  - Brief description (3-4 lines, max-w-xl)
  - Metadata row (rating, year, genres as badges)
  - CTA buttons: "Watch Now" (primary) + "More Info" (secondary with backdrop blur)

**Content Carousels** (4-5 sections):
- Horizontal scrolling rows of anime cards
- Section headers with "See All" links
- Cards: Poster image + title overlay on hover
- Grid: grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7

### Catalog Page
**Filter Sidebar** (sticky, hidden on mobile):
- Genre checkboxes
- Year range selector
- Status filter (Ongoing/Completed)
- Sort dropdown

**Content Grid**:
- Masonry/grid layout: grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
- Poster cards with hover overlay showing quick info
- Pagination at bottom

### Anime Detail Page
**Hero Banner** (50vh):
- Backdrop image with dark gradient overlay
- Breadcrumb navigation
- Anime poster (absolute positioned, -mt-32 to overlap)
- Title, rating, metadata badges

**Content Sections**:
- Two-column layout (lg:grid-cols-3):
  - Main column (lg:col-span-2): Description, trailer embed
  - Sidebar: Quick stats, genres, studio info
- Episodes List: Scrollable grid of episode cards with thumbnails
- Related Anime carousel at bottom

### Video Player Page
**Full-Screen Player Container**:
- 16:9 aspect ratio video container
- Custom controls overlay (bottom): play/pause, timeline scrubber, volume, quality selector, fullscreen
- Episode selector sidebar (collapsible on mobile)
- Next episode autoplay countdown

## Component Library

### Cards
**Anime Poster Card**:
- Aspect ratio: 2:3 (standard poster)
- Rounded corners: rounded-lg
- Hover effect: scale-105 transform, overlay with play icon
- Title overlay at bottom with gradient

**Episode Card**:
- 16:9 thumbnail
- Episode number + title
- Duration badge
- Progress bar (if watched)

### Navigation
**Top Navigation Bar**:
- Fixed header with backdrop blur
- Logo (left), Search bar (center expandable), User menu (right)
- Mobile: Hamburger menu, collapsible search

**Search Interface**:
- Expandable search bar with instant results dropdown
- Result cards: small poster + title + metadata
- "View all results" footer

### Badges & Metadata
- Pill-shaped badges: rounded-full px-3 py-1 text-xs
- Rating badge with star icon
- Genre tags (max 3 visible, "+2 more" for overflow)
- Status indicators (SUB/DUB badges)

### Forms & Inputs
- Consistent rounded-lg styling
- Focus states with subtle glow
- Checkbox/radio custom styling matching dark theme

## Images

### Hero Images
**Homepage Hero**: Large 1920x1080 backdrop from currently airing/featured anime (cinematic shot, not poster)
**Anime Detail Hero**: Wide banner format (1920x600) showing key visual from the series

### Content Images
**Anime Posters**: Vertical 2:3 ratio throughout (300x450 minimum)
**Episode Thumbnails**: 16:9 ratio (640x360 minimum)
**Related Content**: Same poster specs as catalog

### Image Treatment
- Lazy loading for all images
- Blur placeholders while loading
- Gradient overlays on hero/backdrop images for text legibility
- Hover effects: brightness/scale transforms

## Animations
**Minimal & Purposeful**:
- Card hover: transform scale (duration-200)
- Page transitions: fade-in only
- Carousel navigation: smooth scroll behavior
- NO autoplay carousels, NO distracting parallax effects

## Accessibility
- Keyboard navigation for video player controls
- Focus indicators on all interactive elements
- Alt text for all anime posters (title + brief description)
- ARIA labels for icon-only buttons
- Sufficient contrast ratios for text overlays

## Responsive Breakpoints
- Mobile-first approach
- sm: 640px (2-column grid)
- md: 768px (sidebar appears, 3-column grid)
- lg: 1024px (4+ column grid, full sidebar)
- xl: 1280px (maximum content density)

**Mobile Adaptations**:
- Collapse filter sidebar into bottom sheet/modal
- Stack two-column layouts
- Reduce card density (fewer columns)
- Simplified player controls
- Hamburger navigation