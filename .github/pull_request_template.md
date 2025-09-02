# Pull Request

## Description
Brief description of changes made in this PR.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)  
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Refactoring (no functional changes)
- [ ] Performance improvement

## Navigation & Content Changes
- [ ] Updated `/config/navigation.json` (if navigation items changed)
- [ ] Updated HTML files to use placeholder navigation structure
- [ ] Verified all pages have consistent navigation menus
- [ ] Tested navigation links and dropdown functionality

## Testing Checklist
- [ ] All pages load without JavaScript errors
- [ ] Navigation menus are identical across all pages
- [ ] All navigation links work and go to correct locations  
- [ ] Mobile navigation functions properly
- [ ] Logo switching works on scroll (transparent ↔ scrolled)
- [ ] No CSS conflicts or overrides
- [ ] No browser console errors

## CSS & Styling Changes
- [ ] Followed CSS architecture (common.css vs page-specific CSS)
- [ ] Used CSS variables instead of hard-coded values
- [ ] Avoided `!important` declarations
- [ ] CSS validates with Stylelint (run `stylelint css/**/*.css`)
- [ ] Maintained consistent class naming (kebab-case, BEM-style)

## Files Modified
List the main files changed:
- 
- 
- 

## Breaking Changes
List any breaking changes and migration steps:
- 

## Screenshots/Testing
If applicable, add screenshots or describe how to test the changes:

## Additional Context
Any additional information about the PR:

---

## Pre-Submission Checklist
- [ ] Ran navigation validator: `node scripts/validate-navigation.js`
- [ ] Tested on multiple browsers (Chrome, Safari, Firefox)
- [ ] Tested responsive design on mobile devices
- [ ] Code follows project style guide (`docs/styleguide.md`)
- [ ] No hard-coded navigation items in HTML
- [ ] All new files follow naming conventions (kebab-case)