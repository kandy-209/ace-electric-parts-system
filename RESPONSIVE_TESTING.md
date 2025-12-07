# Responsive Design Testing Guide

## Quick Access
- **Live Test Page**: `/test/responsive` - Comprehensive responsive test suite
- **Dev Tools**: Responsive test panel (bottom-right) in development mode

## Breakpoints

| Breakpoint | Width | Device Type |
|------------|-------|-------------|
| Mobile (sm) | < 640px | Phones |
| Tablet (md) | 640px - 768px | Large phones, small tablets |
| Desktop (lg) | 768px - 1024px | Tablets, small laptops |
| Large (xl) | 1024px - 1280px | Desktop |
| XL (2xl) | ≥ 1280px | Large desktop |

## Testing Checklist

### Mobile (< 640px)
- [ ] Navigation collapses to hamburger menu
- [ ] Text sizes are readable (minimum 16px for inputs)
- [ ] Touch targets are at least 44×44px
- [ ] No horizontal scrolling
- [ ] Cards stack in single column
- [ ] Buttons are full-width or appropriately sized
- [ ] Forms are easy to fill on mobile
- [ ] Images scale properly
- [ ] Chat/Voice buttons are accessible

### Tablet (640px - 1024px)
- [ ] Grid layouts use 2 columns
- [ ] Navigation shows full menu
- [ ] Text is appropriately sized
- [ ] Cards use 2-column grid
- [ ] Forms are comfortable to use
- [ ] Interactive elements are touch-friendly

### Desktop (≥ 1024px)
- [ ] Grid layouts use 3-4 columns
- [ ] Full navigation visible
- [ ] Optimal text sizes
- [ ] Hover effects work
- [ ] Animations are smooth
- [ ] No layout breaks

## Testing Tools

### 1. Browser DevTools
```bash
# Chrome/Edge DevTools
F12 → Device Toolbar (Ctrl+Shift+M)
- Test all breakpoints
- Test portrait/landscape
- Test touch simulation
```

### 2. Responsive Test Page
Visit `/test/responsive` to see:
- Live viewport information
- Breakpoint ruler
- Typography scale tests
- Grid layout tests
- Button tests
- Component tests

### 3. Responsive Test Panel (Dev Mode)
In development, a floating panel shows:
- Current viewport size
- Active breakpoint
- Device type
- Touch support
- Orientation

### 4. Real Device Testing
Test on:
- iPhone (various sizes)
- Android phones
- iPad/Android tablets
- Various desktop resolutions

## Key Responsive Features

### Typography
- Headlines: `text-4xl sm:text-6xl lg:text-7xl xl:text-8xl`
- Body: `text-base sm:text-lg lg:text-xl`
- Responsive line heights and spacing

### Layouts
- Grid: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Flex: `flex-col sm:flex-row`
- Spacing: `p-4 sm:p-6 lg:p-8`

### Touch Targets
- Minimum 44×44px on mobile
- Larger padding on mobile
- Adequate spacing between clickable elements

### Performance
- Reduced animations on mobile
- Lighter effects on smaller screens
- Optimized images
- Lazy loading where appropriate

## Common Issues & Fixes

### Horizontal Scrolling
```css
/* Check for fixed widths */
width: 100vw; /* Should be 100% */
max-width: 100vw; /* Use 100% instead */

/* Check padding/margin calculations */
/* Use relative units (rem, %) instead of fixed (px) */
```

### Text Size Issues
```css
/* Mobile: 16px minimum prevents zoom on iOS */
font-size: 16px; /* on mobile */
font-size: 1rem; /* responsive */

/* Use responsive typography scale */
text-sm sm:text-base lg:text-lg
```

### Touch Target Issues
```css
/* Minimum 44×44px on mobile */
min-height: 44px;
min-width: 44px;

/* Adequate spacing */
gap: 1rem; /* on mobile */
```

## Automated Testing

### Viewport Test
The responsive test panel automatically:
- Detects viewport changes
- Shows current breakpoint
- Displays device info

### Visual Regression
Test at these resolutions:
- 375px (iPhone SE)
- 768px (iPad)
- 1024px (Small Desktop)
- 1920px (Full HD)

## Performance Testing

### Mobile Performance
- Test on 3G/4G connection
- Check Lighthouse scores
- Verify Core Web Vitals:
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1

### Desktop Performance
- Test at various resolutions
- Check animation smoothness
- Verify hover effects

## Accessibility

### Mobile Accessibility
- Touch targets meet 44×44px minimum
- Text is readable (minimum 16px)
- Color contrast meets WCAG AA
- No hover-only interactions

### Desktop Accessibility
- Keyboard navigation works
- Focus states are visible
- Screen reader compatible
- Sufficient color contrast

## Testing Commands

```bash
# Build and test
npm run build
npm run dev

# Test specific breakpoints in browser
# Chrome DevTools: Device Toolbar
# Test these devices:
- iPhone SE (375px)
- iPhone 12 Pro (390px)
- iPhone 14 Pro Max (430px)
- iPad (768px)
- iPad Pro (1024px)
- Desktop (1280px+)
```

## Next Steps

1. Test on real devices
2. Check performance metrics
3. Verify accessibility
4. Test with screen readers
5. Test with keyboard only
6. Check print styles (if applicable)

