# Archived Test Pages

This folder contains test and development pages that are no longer actively used in production.

## Archived Routes

### 1. `/test-text`
- **Purpose**: Testing 3D text rendering and glass effects
- **Components**: Glass text 3D experiments
- **Route**: Previously accessible at `http://localhost:3000/test-text`

### 2. `/threejs`
- **Purpose**: Three.js experimentation and testing
- **Components**: Three.js scene testing
- **Route**: Previously accessible at `http://localhost:3000/threejs`

### 3. `/hero-test`
- **Purpose**: Hero section component testing
- **Components**: Hero section variations and experiments
- **Route**: Previously accessible at `http://localhost:3000/hero-test`

### 4. `/test-hero`
- **Purpose**: Additional hero section testing
- **Components**: Hero component variations
- **Route**: Previously accessible at `http://localhost:3000/test-hero`

### 5. `/mof-backup`
- **Purpose**: Museum of Future component backup/testing
- **Components**: MuseumOfFuture backup version
- **Route**: Previously accessible at `http://localhost:3000/mof-backup`
- **Note**: References archived component at `@/components/story-2025/archived/museum-of-future.backup`

### 6. `/new-story`
- **Purpose**: New story implementation experiments
- **Components**: Alternative story sections and UI components
- **Route**: Previously accessible at `http://localhost:3000/new-story`
- **Note**: Components from `@/components/new-story` were removed

## Production Routes

The following routes remain active:
- `/` - Main landing page
- `/2025` - 2025 Real Estate Story (primary story page)
- `/story` - Alternative story implementation
- `/sample` - Sample pages

## Restoration

If you need to restore any of these test pages, simply move them back to the app directory:
```bash
mv src/app/archived/[route-name] src/app/
```

## Notes

These pages were used during development and testing of:
- 3D text effects and materials
- Three.js integrations
- Hero section animations
- Component variations and experiments

They are preserved for reference and can be restored if needed for future development work.

---
*Archived on: 2026-01-03*
