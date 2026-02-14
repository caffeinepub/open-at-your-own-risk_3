# Specification

## Summary
**Goal:** Ensure the Valentine Opening Screen “No” button always stays fully within the visible viewport so it never becomes partially/fully off-screen and remains clickable.

**Planned changes:**
- Update the “No” button random reposition logic to compute safe min/max coordinates based on the current viewport size and the button’s rendered width/height (with padding), and clamp every move within those bounds.
- Recalculate/re-clamp the “No” button position on dynamic viewport changes (resize/orientation/zoom/mobile browser UI changes) to keep the full button visible.

**User-visible outcome:** The “No” button can be clicked repeatedly (even 200+ times) and will always remain fully visible and clickable, including after window resizes or mobile orientation changes.
