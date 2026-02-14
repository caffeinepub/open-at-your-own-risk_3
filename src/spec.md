# Specification

## Summary
**Goal:** Ensure the Valentine Opening Screen “No” button always stays fully within the visible viewport while still moving randomly and playfully.

**Planned changes:**
- Update the “No” button repositioning logic to constrain random positions to viewport-safe bounds that account for the button’s current rendered width/height plus consistent padding.
- Use visible viewport measurements that handle mobile/visual viewport behavior (browser UI show/hide, zoom, orientation changes) so the button never renders partially off-screen.
- On viewport change events (resize/orientation/visualViewport changes/scroll), re-clamp the current “No” button position so it remains fully visible and clickable without affecting other UI behavior.

**User-visible outcome:** Clicking the “No” button always moves it to a fully visible, fully clickable position within the screen on all device sizes and viewport changes, with no other changes to the Valentine flow or UI.
