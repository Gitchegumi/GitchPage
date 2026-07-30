# Quickstart: Verifying Ghost Blog Integration

This guide provides manual smoke tests to verify the full integration between the main site and the Ghost blog.

## 1. Redirect Verification

### Main Blog Index
1. Navigate to `https://www.gitchegumi.com/blog`.
2. **Expected**: Browser automatically redirects to `https://blog.gitchegumi.com`.

### Legacy Post Redirect
1. Navigate to a known legacy URL, e.g., `https://www.gitchegumi.com/blog/tech/why-i-switched-to-neovim`.
2. **Expected**: Browser automatically redirects to `https://blog.gitchegumi.com/why-i-switched-to-neovim`.

---

## 2. Visual Parity Verification

### Header Comparison
1. Open `https://www.gitchegumi.com` and `https://blog.gitchegumi.com` in side-by-side tabs.
2. **Check Navigation Bar**: Colors, spacing, logo size, and typography must match perfectly.
3. **Check Glassmorphism**: Scroll down slightly on both sites; the blur effect behind the nav bar should look identical.
4. **Check Dropdowns**: Open "Work & Content" on both. Social labels (Instagram, X) must be orange on both.

### Footer Comparison
1. Scroll to the bottom of both sites.
2. **Expected**: Layout, legal text, and links must be identical.

---

## 3. Navigation Integrity

### Blog to Main Site
1. On `https://blog.gitchegumi.com`, click "Portfolio" or "Voice Over".
2. **Expected**: You are taken to the correct page on `https://www.gitchegumi.com`.

### Homepage Latest Posts
1. On `https://www.gitchegumi.com` homepage, find the "Latest Blog Posts" section.
2. Click on a post card.
3. **Expected**: You are taken to that post on `https://blog.gitchegumi.com`.

---

## 4. Accessibility Smoke Check

1. On `https://blog.gitchegumi.com`, use the `Tab` key to navigate the header.
2. **Expected**: Focus indicators are visible and follow a logical order.
3. **Expected**: No membership/subscribe buttons are reachable via keyboard (they should be hidden).
