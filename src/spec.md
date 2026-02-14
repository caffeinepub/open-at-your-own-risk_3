# Specification

## Summary
**Goal:** Ensure the Opening Screen’s “No” button and the alternate message cycling continue indefinitely without breaking, and stop cleanly only when the user presses “Yes! 💖”.

**Planned changes:**
- Fix the Opening Screen “No” button so it never disappears and remains visible/clickable indefinitely, moving to a new random on-screen position (clamped within viewport bounds with padding) on every click.
- Ensure the “No” button position is re-clamped to a safe visible position on viewport resize/orientation changes.
- Update the changing message under “Will you be my Valentine? 💖” to cycle through the existing `NO_MESSAGES` in an infinite loop while the Opening Screen is mounted, and stop the loop when the user presses “Yes! 💖” (cleanup timers/intervals on unmount).
- Keep all other Opening Screen visuals, copy, styling, layout, and animations unchanged.

**User-visible outcome:** On the Opening Screen, the “No” button can be clicked 50+ times without ever disappearing, always jumping to a fully visible random position, while the alternate message continues looping until the user presses “Yes! 💖”.
