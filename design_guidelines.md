# Design Guidelines: Insurgent Attacks Tracking Platform

## Design Approach
**Material Design System** - Selected for its robust data visualization patterns, clear hierarchy, and proven effectiveness with information-dense applications. This research and analysis tool prioritizes data comprehension and efficient navigation over aesthetic flourish.

## Core Design Principles
1. **Data First**: Information hierarchy guides every layout decision
2. **Clarity Over Decoration**: Minimal visual noise to maximize focus on critical data
3. **Scannable Information**: Dense content organized for quick comprehension
4. **Professional Gravity**: Serious, respectful presentation befitting the subject matter

## Typography System

**Font Stack**: Roboto (primary), Roboto Mono (data/numbers)
- H1 (Page Titles): 2.5rem, font-medium
- H2 (Section Headers): 2rem, font-medium  
- H3 (Card Titles): 1.5rem, font-medium
- Body Text: 1rem, font-normal
- Data/Stats: 1.125rem, Roboto Mono, font-medium
- Small Labels: 0.875rem, font-normal, uppercase tracking

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-4 to p-6
- Section spacing: py-8 to py-12
- Card gaps: gap-4 to gap-6

**Grid Structure**:
- Main container: max-w-7xl mx-auto px-4
- Map container: Full-width with controlled height (60-70vh)
- Data panels: Sidebar 320px, main content flex-1
- Card grids: grid-cols-1 md:grid-cols-2 lg:grid-cols-3

## Component Library

### Navigation
Top navigation bar with logo, search, and filter controls. Sticky position for constant access. Clean horizontal layout with adequate spacing between elements.

### Interactive Map Section
Full-width map component as the hero element (no image hero - map IS the hero). Height 65vh on desktop, 50vh mobile. Overlay controls in top-right corner (layer toggles, date range). Clustering for multiple attacks in same location. Custom markers with severity indicators.

### Timeline Component
Horizontal scrollable timeline below map showing attack frequency over years. Interactive points expand to show details. Current selection highlighted. Zoom controls for date range adjustment.

### Filter Panel
Left sidebar (desktop) or collapsible drawer (mobile) containing:
- Date range picker (from/to)
- Location filters (country, region dropdowns)
- Attack type checkboxes
- Casualty range sliders
- "Apply Filters" and "Reset" buttons at bottom

### Attack Information Cards
Material-style elevated cards (shadow-md) displaying:
- Date badge (top-right, small pill)
- Location (city, country) as card title
- Attack type icon and label
- Casualty count (KIA/WIA) in data format
- Brief description (2-3 lines max)
- "View Details" link
- Severity indicator (border-left accent, 4px width)

### Detail Modal
Full-screen overlay (desktop: max-w-2xl centered modal) showing:
- Large map section showing exact location
- Complete attack details in structured format
- Source citations
- Related incidents section
- Close button (top-right)

### Statistics Dashboard
Cards grid displaying key metrics:
- Total attacks count
- Total casualties
- Most affected regions
- Attack type breakdown (chart)
- Timeline trends (sparkline)

### Data Table View
Alternative to card view with sortable columns:
- Date | Location | Type | Casualties | Details link
- Pagination controls (bottom)
- Rows per page selector

## Iconography
**Material Icons** (via CDN) for all UI elements:
- Map markers, filter icons, attack type indicators
- Navigation icons (menu, search, close)
- Data visualization icons (trending, location, warning)

## Images
No hero image - the interactive map serves as the primary visual element. For the favicon/logo, use a simple abstract geometric icon representing data/mapping (not literal imagery).

## Responsive Behavior

**Mobile** (< 768px):
- Stack all layouts to single column
- Map reduced to 50vh height
- Filter panel becomes slide-in drawer
- Cards full-width
- Timeline vertical orientation

**Desktop** (> 1024px):
- Side-by-side filter panel + content area
- Multi-column card grids
- Enhanced map controls and overlays
- Horizontal timeline with smooth scrolling

## Key Interactions
- Map: Click markers for quick preview, double-click for full details
- Timeline: Drag to scrub through dates, click points for filtered view  
- Cards: Hover elevates (shadow-lg), click opens detail modal
- Filters: Real-time update of visible attacks on map
- Search: Type-ahead suggestions, instant filtering

This design creates a professional, data-focused platform where researchers can efficiently explore and analyze attack data through multiple interconnected views.